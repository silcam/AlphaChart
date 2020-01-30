import request from "supertest";
import app from "./app";
import { DraftAlphabet, AlphOwnerType } from "../../client/src/models/Alphabet";
import { apiPath } from "../../client/src/api/Api";

export async function loggedInAgent(name?: string) {
  let user = { email: "titus@yahoo.com", password: "minecraft" };
  switch (name) {
    case "Lucy":
      user = { email: "lucy@me.com", password: "princess" };
      break;
    case "Joel":
      user = { email: "joel@aol.com", password: "rockets" };
      break;
  }
  const agent = request.agent(app);
  await agent.post(apiPath("/users/login")).send(user);
  return agent;
}

export function notLoggedInAgent() {
  return request.agent(app);
}

export function vowellybet(
  owner: string,
  ownerType: AlphOwnerType = "user"
): DraftAlphabet {
  return {
    name: "Vowelly",
    owner,
    ownerType,
    chart: {
      cols: 2,
      meta: {},
      styles: {},
      timestamp: Date.now().valueOf(),
      letters: [
        { forms: ["A", "a"], exampleWord: "Apple", imagePath: "" },
        { forms: ["E", "e"], exampleWord: "Egg", imagePath: "" },
        { forms: ["I", "i"], exampleWord: "Igloo", imagePath: "" },
        { forms: ["O", "o"], exampleWord: "Ostrich", imagePath: "" },
        { forms: ["U", "u"], exampleWord: "Ugly", imagePath: "" }
      ]
    }
  };
}
