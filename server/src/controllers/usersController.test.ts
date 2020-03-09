import request from "supertest";
import app from "../app";
import Data from "../storage/Data";
import { loggedInAgent, notLoggedInAgent } from "../testHelper";
import { apiPath, APIError } from "../../../client/src/api/Api";
import { interactsWithMail as iwm } from "nodemailer-stub";

beforeEach(Data.loadFixtures);

afterAll(Data.deleteDatabase);

// test("Get Users", async () => {
//   expect.assertions(2);
//   const agent = notLoggedInAgent();
//   const response = await agent.get(apiPath("/users"));
//   expect(response.status).toBe(200);
//   expect(response.body).toEqual([
//     { name: "Titus", id: "777777777777777777777777" },
//     { name: "Lucy", id: "555555555555555555555555" },
//     { name: "Joel", id: "333333333333333333333333" }
//   ]);
// });

test("Search Users", async () => {
  expect.assertions(8);
  const agent = notLoggedInAgent();
  let response = await agent.get(apiPath("/users/search?q=titus"));
  expect(response.status).toBe(200);
  expect(response.body.users.length).toBe(1);
  expect(response.body.users[0].name).toBe("Titus");

  response = await agent.get(apiPath("/users/search?q=lucy@me"));
  expect(response.status).toBe(200);
  expect(response.body.users.length).toBe(1);
  expect(response.body.users[0].name).toBe("Lucy");

  response = await agent.get(apiPath("/users/search?q=.com"));
  expect(response.status).toBe(200);
  expect(response.body.users.length).toBe(3);
});

test("Create new user", async () => {
  expect.assertions(3);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users")).send({
    email: "madeleine@pm.me",
    name: "Madeleine",
    password: "maddymaddymaddy"
  });
  expect(response.status).toBe(200);
  const mail = iwm.lastMail();
  expect(mail.subject).toEqual("Confirm your Alphachart account");
  expect(mail.to).toEqual(["madeleine@pm.me"]);
});

test("Auto-assign name for new user", async () => {
  expect.assertions(2);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users")).send({
    email: "madeleine@pm.me",
    name: "",
    password: "maddymaddymaddy"
  });
  expect(response.status).toBe(200);
  const mail = iwm.lastMail();
  expect(mail.content).toContain("Hi madeleine,");
});

test("Create existing user", async () => {
  expect.assertions(2);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users")).send({
    email: "titus@yahoo.com",
    name: "T-Man",
    password: "yeahyeahyeah"
  });
  expect(response.status).toBe(422);
  expect(response.body.error).toEqual("User_exists");
});

test("Resend confirmation email", async () => {
  expect.assertions(4);
  const agent = request.agent(app);
  let response = await agent.post(apiPath("/users")).send({
    email: "madeleine@pm.me",
    name: "Madeleine",
    password: "maddymaddymaddy"
  });
  expect(response.status).toBe(200);
  iwm.flushMails();

  response = await agent
    .post(apiPath("/users/resendConfirmation"))
    .send({ email: "madeleine@pm.me" });
  expect(response.status).toBe(200);

  const mail = iwm.lastMail();
  expect(mail.subject).toEqual("Confirm your Alphachart account");
  expect(mail.to).toEqual(["madeleine@pm.me"]);
});

test("Invalid new users", async () => {
  expect.assertions(4);
  const agent = request.agent(app);
  let response = await agent.post(apiPath("/users")).send({
    email: "yo",
    name: "yo",
    password: "yeahyeahyeah"
  });
  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    error: "Invalid_email"
  });

  response = await agent.post(apiPath("/users")).send({
    email: "madeleine@pm.me",
    name: "Maddy",
    password: "tooshort"
  });
  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    error: "Password_too_short"
  });
});

test("Respond to login attempt by unverified user", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  await submitNewUser(agent);
  const response = await agent
    .post(apiPath("/users/login"))
    .send({ email: "madeleine@pm.me", password: "maddymaddymaddy" });
  expect(response.status).toBe(401);
  expect(response.body).toEqual({ error: "Account_not_verified" });
});

test("Verify User", async () => {
  expect.assertions(3);
  const agent = notLoggedInAgent();
  const verification = await submitNewUser(agent);
  const response = await agent
    .post(apiPath("/users/verify"))
    .send({ verification });
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    name: "Madeleine",
    email: "madeleine@pm.me"
  });
  expect(response.body.id).toHaveLength(24);
});

test("Duplicate User Verify", async () => {
  expect.assertions(3);
  const agent = await notLoggedInAgent();
  const verification1 = await submitNewUser(agent);
  const verification2 = await submitNewUser(agent);
  let response = await agent
    .post(apiPath("/users/verify"))
    .send({ verification: verification1 });
  expect(response.status).toBe(200);
  response = await agent
    .post(apiPath("/users/verify"))
    .send({ verification: verification2 });
  expect(response.status).toBe(422);
  expect(response.body.error).toEqual("User_exists");
});

test("Verify with already used code", async () => {
  const agent = await notLoggedInAgent();
  const verification = await submitNewUser(agent);
  let response = await agent
    .post(apiPath("/users/verify"))
    .send({ verification });
  expect(response.status).toBe(200);
  response = await agent.post(apiPath("/users/verify")).send({ verification });
  expect(response.status).toBe(200);
  expect(response.body.name).toEqual("Madeleine");

  // Make sure we didn't duplicate users
  response = await agent.get(apiPath("/users/search?q=Madeleine"));
  expect(response.status).toBe(200);
  expect(response.body.users.length).toBe(1);
});

test("Verify with invalid code", async () => {
  const agent = notLoggedInAgent();
  const response = await agent
    .post(apiPath("/users/verify"))
    .send({ verification: "123abc" });
  expect(response.status).toBe(422);
  expect(response.body.error).toBe("Invalid_code");
});

test("Current User - Not logged in", async () => {
  expect.assertions(1);
  const agent = request.agent(app);
  const response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({
    currentUser: {},
    groups: [],
    alphabetListings: []
  });
});

test("Current User", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const response = await agent.get(apiPath("/users/current"));
  expect(response.body.currentUser).toEqual({
    id: "777777777777777777777777",
    name: "Titus",
    email: "titus@yahoo.com"
  });
  expect(response.body.groups[0].name).toBe("Boys Team");
  expect(response.body.alphabetListings.length).toBe(3);
});

test("Valid Login", async () => {
  expect.assertions(3);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users/login")).send({
    email: "titus@yahoo.com",
    password: "minecraft"
  });
  expect(response.body.currentUser).toEqual({
    id: "777777777777777777777777",
    name: "Titus",
    email: "titus@yahoo.com"
  });
  expect(response.body.groups.length).toBe(1);
  expect(response.body.alphabetListings.length).toBe(3);
});

test("InValid Login", async () => {
  expect.assertions(2);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users/login")).send({
    email: "titus@yahoo.com",
    password: "wrong!"
  });
  expect(response.status).toEqual(401);
  expect(response.body).toEqual({ error: "Invalid_login" });
});

test("Logout", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  let response = await agent.post(apiPath("/users/logout"));
  expect(response.status).toBe(200);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body.currentUser).toEqual({});
});

test("Post Locale - Not logged in", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/users/locale"))
    .send({ locale: "fr" });
  expect(response.status).toBe(200);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body.currentUser).toEqual({ locale: "fr" });
});

test("Post Locale - Logged in", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  let response = await agent
    .post(apiPath("/users/locale"))
    .send({ locale: "fr" });
  expect(response.status).toBe(200);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body.currentUser).toEqual({
    id: "777777777777777777777777",
    name: "Titus",
    email: "titus@yahoo.com",
    locale: "fr"
  });
});

test("Update user name", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/users/777777777777777777777777/update"))
    .send({ name: "RT!" });
  expect(response.status).toBe(200);
  expect(response.body.users[0].name).toBe("RT!");
  expect(response.body.currentUser.name).toBe("RT!");
});

// test("Update user password", async () => {
//   expect.assertions(2);
//   const agent = await loggedInAgent();
//   let response = await agent
//     .post(apiPath("/users/777777777777777777777777/update"))
//     .send({ password: "winkywonkydonkey" });
//   expect(response.status).toBe(200);
//   response = await agent
//     .post(apiPath("/users/login"))
//     .send({ email: "titus@yahoo.com", password: "winkywonkydonkey" });
//   expect(response.status).toBe(200);
// });

test("Update user email", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/users/777777777777777777777777/update"))
    .send({ email: "rt@yahoo.com" });
  expect(response.status).toBe(200);
  expect(response.body.currentUser.email).toBe("rt@yahoo.com");
});

test("Can't update email to another user's email", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/users/777777777777777777777777/update"))
    .send({ email: "lucy@me.com" });
  expect(response.status).toBe(422);
  expect(response.body.errorCode).toBe(APIError.EmailInUse);
});

test("Can't update other users", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent("Lucy");
  const response = await agent
    .post(apiPath("/users/777777777777777777777777/update"))
    .send({ name: "RT!" });
  expect(response.status).toBe(401);
});

async function submitNewUser(agent: request.SuperTest<request.Test>) {
  const response = await agent.post(apiPath("/users")).send({
    email: "madeleine@pm.me",
    name: "Madeleine",
    password: "maddymaddymaddy"
  });
  // expect(response.status).toBe(204);
  const mail = iwm.lastMail();
  const verification = /\/users\/verify\/(.+?)"/.exec(mail.content)![1];
  return verification;
}

test("Change Password", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  let response = await agent
    .post(apiPath("/users/777777777777777777777777/changePassword"))
    .send({ password: "minecraft", newPassword: "lego spaceships" });
  expect(response.status).toBe(200);

  response = await notLoggedInAgent()
    .post(apiPath("/users/login"))
    .send({ email: "titus@yahoo.com", password: "lego spaceships" });
  expect(response.status).toBe(200);
});

test("Bad Change Password", async () => {
  expect.assertions(4);
  const agent = await loggedInAgent();
  let response = await agent
    .post(apiPath("/users/777777777777777777777777/changePassword"))
    .send({ password: "wrong", newPassword: "lego spaceshipts" });
  expect(response.status).toBe(401);
  expect(response.body.errorCode).toBe(APIError.BadPassword);

  response = await agent
    .post(apiPath("/users/555555555555555555555555/changePassword"))
    .send({ password: "princess", newPassword: "lego spaceships" });
  expect(response.status).toBe(401);

  response = await agent
    .post(apiPath("/users/777777777777777777777777/changePassword"))
    .send({ password: "minecraft", newPassword: "" });
  expect(response.status).toBe(422);
});

test("Password Reset", async () => {
  expect.assertions(8);
  iwm.flushMails();
  const agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/users/resetPassword"))
    .send({ email: "titus@yahoo.com" });
  expect(response.status).toBe(200);

  const mail = iwm.lastMail();
  expect(mail.subject).toEqual("Alphachart Password Reset");
  expect(mail.to).toEqual(["titus@yahoo.com"]);

  const code = mail.content.match(/passwordReset\/(.+?)"/)![1];
  response = await agent.get(apiPath(`/users/passwordReset/${code}`));
  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    name: "Titus",
    id: "777777777777777777777777"
  });

  response = await agent
    .post(apiPath("/users/777777777777777777777777/changePassword"))
    .send({ resetKey: code, newPassword: "Go Harry Kane!" });
  expect(response.status).toBe(200);

  response = await agent
    .post(apiPath("/users/login"))
    .send({ email: "titus@yahoo.com", password: "Go Harry Kane!" });
  expect(response.status).toBe(200);

  response = await agent.get(apiPath(`/users/passwordReset/${code}`));
  expect(response.status).toBe(422);
});

test("Password Reset - Invalid Email", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/users/resetPassword"))
    .send({ email: "nobody@nowhere.com" });
  expect(response.status).toBe(422);
  expect(response.body.errorCode).toBe(APIError.NoSuchEmail);
});

test("Password Reset - Get User with Invalid reset key", async () => {
  expect.assertions(1);
  const agent = notLoggedInAgent();
  const response = await agent.get(
    apiPath("/users/passwordReset/not-a-real-key")
  );
  expect(response.status).toBe(422);
});

test("Password Reset - Post Change with invalid key", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/users/777777777777777777777777/changePassword"))
    .send({ resetKey: "not-even-close", newPassword: "Go Harry Kane!" });
  expect(response.status).toBe(401);

  await agent
    .post(apiPath("/users/resetPassword"))
    .send({ email: "lucy@me.com" });
  const code = iwm.lastMail().content.match(/passwordReset\/(.+?)"/)![1];
  response = await agent
    .post(apiPath("/users/777777777777777777777777/changePassword"))
    .send({ resetKey: code, newPassword: "I'm actually Lucy" });
  expect(response.status).toBe(401);
});
