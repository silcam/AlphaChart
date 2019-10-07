import request from "supertest";
import app from "../app";
import Data from "../storage/Data";
import { loggedInAgent } from "../testHelper";

beforeEach(Data.loadFixtures);

afterEach(Data.deleteDatabase);

test("Create new user", async () => {
  expect.assertions(1);
  const agent = request.agent(app);
  const response = await agent.post("/api/users").send({
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
  const response = await agent.post("/api/users").send({
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
  const response = await agent.post("/api/users").send({
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
  let response = await agent.post("/api/users").send({
    email: "yo",
    name: "yo",
    password: "yeahyeahyeah"
  });
  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    error: "Email is invalid."
  });

  response = await agent.post("/api/users").send({
    email: "madeleine@pm.me",
    name: "Maddy",
    password: "tooshort"
  });
  expect(response.status).toBe(422);
  expect(response.body).toEqual({
    error: "Please choose a password with at least 10 characters."
  });
});

test("Current User - Not logged in", async () => {
  const agent = request.agent(app);
  const response = await agent.get("/api/users/current");
  expect(response.body).toBeNull();
});

test("Current User", async () => {
  const agent = await loggedInAgent();
  const response = await agent.get("/api/users/current");
  expect(response.body).toEqual({ name: "Titus", email: "titus@yahoo.com" });
});

test("Valid Login", async () => {
  expect.assertions(1);
  const agent = request.agent(app);
  const response = await agent
    .post("/api/users/login")
    .send({ email: "titus@yahoo.com", password: "minecraft" });
  expect(response.body).toEqual({ name: "Titus", email: "titus@yahoo.com" });
});

test("InValid Login", async () => {
  expect.assertions(2);
  const agent = request.agent(app);
  const response = await agent
    .post("/api/users/login")
    .send({ email: "titus@yahoo.com", password: "wrong!" });
  expect(response.status).toEqual(401);
  expect(response.body).toEqual({ error: "Invalid login" });
});

test("Logout", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  let response = await agent.post("/api/users/logout");
  expect(response.status).toBe(204);
  response = await agent.get("/api/users/current");
  expect(response.body).toBeNull();
});
