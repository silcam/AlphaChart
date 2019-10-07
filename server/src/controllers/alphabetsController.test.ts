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

  response = await agent.get("/api/alphabets/notevenclose");
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

test("Login required to create/modify", async () => {
  expect.assertions(1);
  const agent = notLoggedInAgent();
  let response = await agent.post("/api/alphabets").send(vowellybet());
  expect(response.status).toBe(401);
});
