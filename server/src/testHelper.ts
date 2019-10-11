import request from "supertest";
import app from "./app";
import { DraftAlphabet } from "../../client/src/models/Alphabet";

export async function loggedInAgent(name?: string) {
  let user = { email: "titus@yahoo.com", password: "minecraft" };
  switch (name) {
    case "Lucy":
      user = { email: "lucy@me.com", password: "princess" };
  }
  const agent = request.agent(app);
  await agent.post("/api/users/login").send(user);
  return agent;
}

export function notLoggedInAgent() {
  return request.agent(app);
}

export function vowellybet(): DraftAlphabet {
  return {
    name: "Vowelly",
    chart: {
      cols: 2,
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
