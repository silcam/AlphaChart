import { notLoggedInAgent } from "../testHelper";

test("Get alphabets", async () => {
  expect.assertions(1);
  const agent = notLoggedInAgent();
  const response = await agent.get("/api/v/1/alphabets");
  expect(response.status).toBe(410);
});
