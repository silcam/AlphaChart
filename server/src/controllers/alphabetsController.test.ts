import Data from "../storage/Data";
import { loggedInAgent, vowellybet, notLoggedInAgent } from "../testHelper";
import { Alphabet, AlphabetListing } from "../../../client/src/models/Alphabet";
import { User } from "../../../client/src/models/User";
import { apiPath } from "../../../client/src/api/Api";

beforeEach(Data.loadFixtures);

afterAll(Data.deleteDatabase);

test("Get alphabets", async () => {
  expect.assertions(3);
  const agent = notLoggedInAgent();
  const response = await agent.get(apiPath("/alphabets"));
  expect(response.body.alphabetListings[0]).toMatchObject({
    name: "Ελληνικα",
    id: "5d4c38e158e6dbb33d7d7b12"
  });
  expect(response.body.users.length).toEqual(2);
  expect(response.body.groups.length).toEqual(1);
});

test("Get an alphabet", async () => {
  expect.assertions(3);
  const agent = notLoggedInAgent();
  const response = await agent.get(
    apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12")
  );
  expect(response.status).toBe(200);
  expect(response.body.alphabets[0].name).toEqual("Ελληνικα");
  expect(response.body.users[0].name).toEqual("Titus");
});

test("Get an alphabet with guest users", async () => {
  expect.assertions(3);
  const agent = notLoggedInAgent();
  const response = await agent.get(
    apiPath("/alphabets/123abc123abc123abc123abc")
  );
  expect(response.status).toBe(200);
  expect(response.body.alphabets[0].name).toEqual("Gude");
  expect(response.body.users.map((u: User) => u.name)).toEqual([
    "Lucy",
    "Titus"
  ]);
});

test("Get a group alphabet", async () => {
  expect.assertions(3);
  const agent = notLoggedInAgent();
  const response = await agent.get(
    apiPath("/alphabets/789def789def789def789def")
  );
  expect(response.status).toBe(200);
  expect(response.body.alphabets[0].name).toEqual("Bana");
  expect(response.body.groups[0].name).toEqual("Boys Team");
});

test("Get nonexistant alphabet", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  let response = await agent.get(
    apiPath("/alphabets/111111111111111111111111")
  );
  expect(response.status).toBe(404);

  response = await agent.get(apiPath("/alphabets/notevenclose!"));
  expect(response.status).toBe(404);
});

test("Create alphabet", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const vowelly = vowellybet("777777777777777777777777");
  const response = await agent.post(apiPath("/alphabets")).send(vowelly);
  const alphabet: Alphabet = response.body;
  expect(alphabet.owner).toEqual("777777777777777777777777");
  expect(alphabet.name).toEqual("Vowelly");
  expect(alphabet.chart.letters).toEqual(vowelly.chart.letters);
});

test("Create alphabet for group", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const vowelly = vowellybet("111111111111111111111111", "group");
  const response = await agent.post(apiPath("/alphabets")).send(vowelly);
  const alphabet: Alphabet = response.body;
  expect(alphabet.owner).toEqual("111111111111111111111111");
  expect(alphabet.name).toEqual("Vowelly");
  expect(alphabet.chart.letters).toEqual(vowelly.chart.letters);
});

test("Update alphabet name", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/update"))
    .send({ name: "Greekish" });
  expect(response.status).toBe(200);
  expect(response.body.alphabets[0].name).toBe("Greekish");
  expect(response.body.alphabetListings[0].name).toBe("Greekish");
});

test("Update nonexistant alphabet", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/alphabets/000000000000000000000000/update"))
    .send({ name: "Greekish" });
  expect(response.status).toBe(404);
});

test("Update chart permissions", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/alphabets/123abc123abc123abc123abc/update"))
    .send({ name: "Greekish" });
  expect(response.status).toBe(401);
});

test("Update alphabet chart", async () => {
  expect.assertions(4);
  const agent = await loggedInAgent();
  const vowellyChart = vowellybet("").chart;
  const response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/charts"))
    .send(vowellyChart);
  expect(response.status).toBe(200);
  const alphabet: Alphabet = response.body;
  expect(alphabet.name).toEqual("Ελληνικα");
  expect(alphabet.chart.cols).toEqual(2);
  expect(alphabet.chart.letters).toEqual(vowellyChart.letters);
});

test("Upload image to alphabet chart", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/images"))
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.body.path).toMatch(
    /\/images\/5d4c38e158e6dbb33d7d7b12\/\d+\.png/
  );
});

test("Update nonexistant chart", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();

  let response = await agent
    .post(apiPath("/alphabets/000000000000000000000000/charts"))
    .send(vowellybet("777777777777777777777777").chart);
  expect(response.status).toBe(404);

  response = await agent
    .post(apiPath("/alphabets/000000000000000000000000/images"))
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.status).toBe(404);
});

test("Login required to create/modify", async () => {
  expect.assertions(5);
  const agent = notLoggedInAgent();
  let response = await agent
    .post(apiPath("/alphabets"))
    .send(vowellybet("777777777777777777777777"));
  expect(response.status).toBe(401);

  response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/charts"))
    .send(vowellybet("").chart);
  expect(response.status).toBe(401);

  const lucyAgent = await loggedInAgent("Lucy");
  response = await lucyAgent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/charts"))
    .send(vowellybet("").chart);
  expect(response.status).toBe(401);

  response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/images"))
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.status).toBe(401);

  response = await lucyAgent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/images"))
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.status).toBe(401);
});

test("Copy Alphabet", async () => {
  expect.assertions(3);
  const lucyAgent = await loggedInAgent("Lucy");

  let response = await lucyAgent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/copy"))
    .send({ owner: "555555555555555555555555", ownerType: "user" });
  expect(response.status).toBe(200);
  const id = response.body.id;
  response = await lucyAgent.get(apiPath(`/alphabets/${id}`));
  expect(response.status).toBe(200);
  expect(response.body.alphabets[0]).toMatchObject({
    name: "Ελληνικα",
    owner: "555555555555555555555555"
  });
});

test("Copy Alphabet Errors", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  const titusAgent = await loggedInAgent();
  const lucyAgent = await loggedInAgent("Lucy");

  // let response = await agent
  //   .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/copy"))
  //   .send({ owner: "555555555555555555555555", ownerType: "user" });
  // expect(response.status).toBe(401);

  let response = await lucyAgent
    .post(apiPath("/alphabets/000000000000000000000000/copy"))
    .send({ owner: "555555555555555555555555", ownerType: "user" });
  expect(response.status).toBe(404);

  // Can't copy an alphabet you already own
  response = await titusAgent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/copy"))
    .send({ owner: "777777777777777777777777", ownerType: "user" });
  expect(response.status).toBe(422);
});

test("Share alphabet", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();
  const response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/share"))
    .send({ userId: "555555555555555555555555" });
  expect(response.status).toBe(200);
  expect(response.body.alphabets[0].users).toContain(
    "555555555555555555555555"
  );
});

test("Share alphabet errors", async () => {
  expect.assertions(4);
  const agent = await loggedInAgent();

  // Wrong alphabet id
  let response = await agent
    .post(apiPath("/alphabets/000000000000000000000000/share"))
    .send({ userId: "555555555555555555555555" });
  expect(response.status).toBe(404);

  // Wrong user id
  response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/share"))
    .send({ userId: "000000000000000000000000" });
  expect(response.status).toBe(404);

  // Does not control alphabet
  response = await agent
    .post(apiPath("/alphabets/123abc123abc123abc123abc/share"))
    .send({ userId: "333333333333333333333333" });
  expect(response.status).toBe(401);

  // Not logged in
  response = await notLoggedInAgent()
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/share"))
    .send({ userId: "333333333333333333333333" });
  expect(response.status).toBe(401);
});

test("Unshare alphabet", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent("Lucy");
  const response = await agent
    .post(apiPath("/alphabets/123abc123abc123abc123abc/unshare"))
    .send({ userId: "777777777777777777777777" });
  expect(response.status).toBe(200);
  expect(response.body.users).toEqual([]);
});

test("Unshare alphabet errors", async () => {
  expect.assertions(5);
  const agent = await loggedInAgent("Lucy");

  // Wrong alphabet id
  let response = await agent
    .post(apiPath("/alphabets/000000000000000000000000/unshare"))
    .send({ userId: "555555555555555555555555" });
  expect(response.status).toBe(404);

  // Wrong user id is no-op
  response = await agent
    .post(apiPath("/alphabets/123abc123abc123abc123abc/unshare"))
    .send({ userId: "000000000000000000000000" });
  expect(response.status).toBe(200);
  expect(response.body.users).toEqual(["777777777777777777777777"]);

  // Does not control alphabet
  response = await agent
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/unshare"))
    .send({ userId: "333333333333333333333333" });
  expect(response.status).toBe(401);

  // Not logged in
  response = await notLoggedInAgent()
    .post(apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/unshare"))
    .send({ userId: "333333333333333333333333" });
  expect(response.status).toBe(401);
});

test("Archive alphabet", async () => {
  expect.assertions(4);
  const agent = await loggedInAgent();
  let response = await agent.post(
    apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/archive")
  );
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ id: "5d4c38e158e6dbb33d7d7b12" });
  response = await agent.get(apiPath("/alphabets"));
  expect(
    response.body.alphabetListings.map((al: AlphabetListing) => al.id)
  ).not.toContain("5d4c38e158e6dbb33d7d7b12");
  response = await agent.get(
    apiPath("/archivedAlphabets/5d4c38e158e6dbb33d7d7b12")
  );
  expect(response.body.name).toBe("Ελληνικα");
});

test("Archive permission", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent("Lucy");
  let response = await agent.post(
    apiPath("/alphabets/5d4c38e158e6dbb33d7d7b12/archive")
  );
  expect(response.status).toBe(401);
});

test("Archive nonexistant", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  let response = await agent.post(
    apiPath("/alphabets/000000000000000000000000/archive")
  );
  expect(response.status).toBe(404);
});
