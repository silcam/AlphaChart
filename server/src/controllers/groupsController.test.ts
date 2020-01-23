import { loggedInAgent, notLoggedInAgent } from "../testHelper";
import { apiPath } from "../../../client/src/api/Api";
import Data from "../storage/Data";
import { User } from "../../../client/src/models/User";

beforeEach(Data.loadFixtures);

afterAll(Data.deleteDatabase);

test("Get groups", async () => {
  expect.assertions(5);
  const agent = notLoggedInAgent();
  const response = await agent.get(apiPath("/groups"));
  expect(response.status).toBe(200);
  expect(response.body.groups).toEqual([
    {
      id: "111111111111111111111111",
      name: "Boys Team",
      users: ["777777777777777777777777", "333333333333333333333333"]
    }
  ]);
  expect(response.body.alphabetListings[0]).toMatchObject({ name: "Bana" });
  const usernames = response.body.users.map((u: User) => u.name);
  expect(usernames).toContain("Titus");
  expect(usernames).toContain("Joel");
});

test("Create Group", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups"))
    .send({ name: "Thunder Clan" });
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    name: "Thunder Clan",
    users: ["777777777777777777777777"]
  });
  expect(typeof response.body.id).toBe("string");
});

test("Must be logged in to create group", async () => {
  expect.assertions(1);
  const agent = notLoggedInAgent();
  const response = await agent
    .post(apiPath("/groups"))
    .send({ name: "Thunder Clan" });
  expect(response.status).toBe(401);
});

test("Update Group Name", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/111111111111111111111111/update"))
    .send({ name: "Pizza Munchers" });
  expect(response.status).toBe(200);
  expect(response.body.groups[0].name).toBe("Pizza Munchers");
});

test("Update nonexistant group", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/111111111111111111111199/update"))
    .send({ name: "Pizza Munchers" });
  expect(response.status).toBe(404);
});

test("Update Group Permissions", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent("Lucy");
  const response = await agent
    .post(apiPath("/groups/111111111111111111111111/update"))
    .send({ name: "Pizza Munchers" });
  expect(response.status).toBe(401);
});

test("Add Group User", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/111111111111111111111111/addUser"))
    .send({ id: "555555555555555555555555" });
  expect(response.status).toBe(200);
  expect(response.body.groups[0].users).toContain("555555555555555555555555");
  expect(response.body.users.length).toBe(3);
});

test("Must be group member to add user", async () => {
  expect.assertions(2);
  let agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/groups/111111111111111111111111/addUser"))
    .send({ id: "555555555555555555555555" });
  expect(response.status).toBe(401);

  agent = await loggedInAgent("Lucy");
  response = await agent
    .post(apiPath("/groups/111111111111111111111111/addUser"))
    .send({ id: "555555555555555555555555" });
  expect(response.status).toBe(401);
});

test("Add to group - nonexistant group", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/000000000000000000000000/addUser"))
    .send({ id: "555555555555555555555555" });
  expect(response.status).toBe(404);
});

test("Add to group - nonexistant user", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/111111111111111111111111/addUser"))
    .send({ id: "000000000000000000000000" });
  expect(response.status).toBe(404);
});

test("Remove Group User", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/111111111111111111111111/removeUser"))
    .send({ id: "333333333333333333333333" });
  expect(response.status).toBe(200);
  expect(response.body.groups[0].users.length).toBe(1);
  expect(response.body.groups[0].users).not.toContain(
    "333333333333333333333333"
  );
});

test("Must be group member to remove user", async () => {
  expect.assertions(2);
  let agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/groups/111111111111111111111111/removeUser"))
    .send({ id: "333333333333333333333333" });
  expect(response.status).toBe(401);

  agent = await loggedInAgent("Lucy");
  response = await agent
    .post(apiPath("/groups/111111111111111111111111/removeUser"))
    .send({ id: "333333333333333333333333" });
  expect(response.status).toBe(401);
});

test("Remove from group - nonexistant group", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/000000000000000000000000/removeUser"))
    .send({ id: "333333333333333333333333" });
  expect(response.status).toBe(404);
});

test("Remove from group - user not in group is no-op", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/groups/111111111111111111111111/removeUser"))
    .send({ id: "555555555555555555555555" });
  expect(response.status).toBe(200);
  expect(response.body.groups[0].users).toEqual([
    "777777777777777777777777",
    "333333333333333333333333"
  ]);
});
