import Data from "../storage/Data";
import { loggedInAgent, vowellybet, notLoggedInAgent } from "../testHelper";
import { Alphabet } from "../../../client/src/models/Alphabet";

beforeEach(Data.loadFixtures);

afterEach(Data.deleteDatabase);

test("Get alphabets", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  const response = await agent.get("/api/alphabets");
  expect(response.body[0].name).toEqual("Ελληνικα");
  expect(response.body[0]._id).toEqual("5d4c38e158e6dbb33d7d7b12");
});

test("Get my alphabets", async () => {
  expect.assertions(3);
  let agent = notLoggedInAgent();
  let response = await agent.get("/api/alphabets/mine");
  expect(response.body).toEqual([]);

  agent = await loggedInAgent("Titus");
  response = await agent.get("/api/alphabets/mine");
  expect(response.body[0].name).toEqual("Ελληνικα");

  agent = await loggedInAgent("Lucy");
  response = await agent.get("/api/alphabets/mine");
  expect(response.body).toEqual([]);
});

test("Get an alphabet", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  const response = await agent.get("/api/alphabets/5d4c38e158e6dbb33d7d7b12");
  expect(response.status).toBe(200);
  expect(response.body.name).toEqual("Ελληνικα");
});

test("Get nonexistant alphabet", async () => {
  expect.assertions(2);
  const agent = notLoggedInAgent();
  let response = await agent.get("/api/alphabets/111111111111111111111111");
  expect(response.status).toBe(404);

  response = await agent.get("/api/alphabets/notevenclose!");
  expect(response.status).toBe(404);
});

test("Create alphabet", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const vowelly = vowellybet();
  const response = await agent.post("/api/alphabets").send(vowelly);
  const alphabet: Alphabet = response.body;
  expect(alphabet.user).toEqual("titus@yahoo.com");
  expect(alphabet.name).toEqual("Vowelly");
  expect(alphabet.charts[0].letters).toEqual(vowelly.chart.letters);
});

test("Update alphabet chart", async () => {
  expect.assertions(3);
  const agent = await loggedInAgent();
  const vowelly = vowellybet();
  const response = await agent
    .post("/api/alphabets/5d4c38e158e6dbb33d7d7b12/charts")
    .send(vowelly.chart);
  const alphabet: Alphabet = response.body;
  expect(alphabet.name).toEqual("Ελληνικα");
  expect(alphabet.charts[0].cols).toEqual(2);
  expect(alphabet.charts[0].letters).toEqual(vowelly.chart.letters);
});

test("Upload image to alphabet chart", async () => {
  expect.assertions(1);
  const agent = await loggedInAgent();
  const response = await agent
    .post("/api/alphabets/5d4c38e158e6dbb33d7d7b12/images")
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.body.path).toMatch(
    /\/images\/5d4c38e158e6dbb33d7d7b12\/\d+\.png/
  );
});

test("Update nonexistant chart", async () => {
  expect.assertions(2);
  const agent = await loggedInAgent();

  let response = await agent
    .post("/api/alphabets/nonexistant/charts")
    .send(vowellybet().chart);
  expect(response.status).toBe(404);

  response = await agent
    .post("/api/alphabets/nonexistant/images")
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.status).toBe(404);
});

test("Login required to create/modify", async () => {
  expect.assertions(5);
  const agent = notLoggedInAgent();
  let response = await agent.post("/api/alphabets").send(vowellybet());
  expect(response.status).toBe(401);

  response = await agent
    .post("/api/alphabets/5d4c38e158e6dbb33d7d7b12/charts")
    .send(vowellybet().chart);
  expect(response.status).toBe(401);

  const lucyAgent = await loggedInAgent("Lucy");
  response = await lucyAgent
    .post("/api/alphabets/5d4c38e158e6dbb33d7d7b12/charts")
    .send(vowellybet().chart);
  expect(response.status).toBe(401);

  response = await agent
    .post("/api/alphabets/5d4c38e158e6dbb33d7d7b12/images")
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.status).toBe(401);

  response = await lucyAgent
    .post("/api/alphabets/5d4c38e158e6dbb33d7d7b12/images")
    .attach("image", "server/src/storage/test/images/apple.png");
  expect(response.status).toBe(401);
});

test("Copy Alphabet", async () => {
  expect.assertions(2);
  const lucyAgent = await loggedInAgent("Lucy");

  let response = await lucyAgent.post(
    "/api/alphabets/5d4c38e158e6dbb33d7d7b12/copy"
  );
  const id = response.body._id;
  response = await lucyAgent.get(`/api/alphabets/${id}`);
  expect(response.body.name).toEqual("Ελληνικα");
  expect(response.body.user).toEqual("lucy@me.com");
});

test("Copy Alphabet Errors", async () => {
  expect.assertions(3);
  const agent = notLoggedInAgent();
  const titusAgent = await loggedInAgent();
  const lucyAgent = await loggedInAgent("Lucy");

  let response = await agent.post(
    "/api/alphabets/5d4c38e158e6dbb33d7d7b12/copy"
  );
  expect(response.status).toBe(401);

  response = await lucyAgent.post("/api/alphabets/123/copy");
  expect(response.status).toBe(404);

  // Can't copy an alphabet you already own
  response = await titusAgent.post(
    "/api/alphabets/5d4c38e158e6dbb33d7d7b12/copy"
  );
  expect(response.status).toBe(422);
});
