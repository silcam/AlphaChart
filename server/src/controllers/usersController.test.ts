import request from "supertest";
import app from "../app";
import Data from "../storage/Data";
import { loggedInAgent, notLoggedInAgent } from "../testHelper";
import { apiPath } from "../../../client/src/models/Api";

beforeEach(Data.loadFixtures);

afterEach(Data.deleteDatabase);

test("Create new user", async () => {
  expect.assertions(1);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users")).send({
    email: "madeleine@pm.me",
    name: "Madeleine",
    password: "maddymaddymaddy"
  });
  expect(response.body).toEqual({
    name: "Madeleine",
    email: "madeleine@pm.me"
  });
});

test("Auto-assign name for new user", async () => {
  expect.assertions(1);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users")).send({
    email: "madeleine@pm.me",
    name: "",
    password: "maddymaddymaddy"
  });
  expect(response.body).toEqual({
    name: "madeleine",
    email: "madeleine@pm.me"
  });
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
  expect(response.body).toEqual({
    error: "A user already exists for titus@yahoo.com"
  });
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

test("Current User - Not logged in", async () => {
  const agent = request.agent(app);
  const response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({});
});

test("Current User", async () => {
  const agent = await loggedInAgent();
  const response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({ name: "Titus", email: "titus@yahoo.com" });
});

test("Valid Login", async () => {
  expect.assertions(1);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users/login")).send({
    email: "titus@yahoo.com",
    password: "minecraft"
  });
  expect(response.body).toEqual({ name: "Titus", email: "titus@yahoo.com" });
});

test("InValid Login", async () => {
  expect.assertions(2);
  const agent = request.agent(app);
  const response = await agent.post(apiPath("/users/login")).send({
    email: "titus@yahoo.com",
    password: "wrong!"
  });
  expect(response.status).toEqual(401);
  expect(response.body).toEqual({ error: "Invalid login" });
});

test("Logout", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  let response = await agent.post(apiPath("/users/logout"));
  expect(response.status).toBe(204);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({});
});

test("Post Locale - Not logged in", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/users/locale"))
    .send({ locale: "fr" });
  expect(response.status).toBe(204);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({ locale: "fr" });
});

test("Post Locale - Logged in", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  let response = await agent
    .post(apiPath("/users/locale"))
    .send({ locale: "fr" });
  expect(response.status).toBe(204);
  response = await agent.get(apiPath("/users/current"));
  expect(response.body).toEqual({
    name: "Titus",
    email: "titus@yahoo.com",
    locale: "fr"
  });
});
