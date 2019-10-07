import request from "supertest";
import app from "./app";

export async function loggedInAgent(name?: string) {
  let user = { email: "titus@yahoo.com", password: "minecraft" };
  // switch(name) {
  //    case "lucy": user = lucy
  // }
  const agent = request.agent(app);
  await agent.post("/api/users/login").send(user);
  return agent;
}
