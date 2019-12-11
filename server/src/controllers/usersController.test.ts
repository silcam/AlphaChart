import request from "supertest";
import app from "../app";
import Data from "../storage/Data";
import { loggedInAgent, notLoggedInAgent } from "../testHelper";
import { apiPath } from "../../../client/src/api/Api";
import { interactsWithMail as iwm } from "nodemailer-stub";

beforeEach(Data.loadFixtures);

afterEach(Data.deleteDatabase);

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

test("Verify with invalid (already used) code", async () => {
  expect.assertions(3);
  const agent = await notLoggedInAgent();
  const verification = await submitNewUser(agent);
  let response = await agent
    .post(apiPath("/users/verify"))
    .send({ verification });
  expect(response.status).toBe(200);
  response = await agent.post(apiPath("/users/verify")).send({ verification });
  expect(response.status).toBe(422);
  expect(response.body.error).toEqual("Invalid_code");
});

test("Current User - Not logged in", async () => {
  const agent = request.agent(app);
  const response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({});
});

test("Current User", async () => {
  const agent = await loggedInAgent();
  const response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({
    id: "777777777777777777777777",
    name: "Titus",
    email: "titus@yahoo.com"
  });
});

test("Valid Login", async () => {
  expect.assertions(1);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users/login")).send({
    email: "titus@yahoo.com",
    password: "minecraft"
  });
  expect(response.body).toEqual({
    id: "777777777777777777777777",
    name: "Titus",
    email: "titus@yahoo.com"
  });
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
  expect(response.body).toEqual({});
});

test("Post Locale - Not logged in", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/users/locale"))
    .send({ locale: "fr" });
  expect(response.status).toBe(200);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({ locale: "fr" });
});

test("Post Locale - Logged in", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  let response = await agent
    .post(apiPath("/users/locale"))
    .send({ locale: "fr" });
  expect(response.status).toBe(200);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({
    id: "777777777777777777777777",
    name: "Titus",
    email: "titus@yahoo.com",
    locale: "fr"
  });
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
