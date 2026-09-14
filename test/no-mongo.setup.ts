// Unit-test guard: nothing in the `unit` project may reach a real Mongo.
// Tests that legitimately need the database live in *.int.test.ts and run
// under `yarn test:integration`.
import { vi, beforeAll } from "vitest";

const refuse = (method: string) => () => {
  throw new Error(
    `Data.${method}() was called from a unit test. Unit tests must not touch Mongo — ` +
      `rename this file to *.int.test.ts and run it with \`yarn test:integration\`.`
  );
};

vi.mock("../server/src/storage/Data", () => ({
  default: {
    db: refuse("db"),
    loadFixtures: refuse("loadFixtures"),
    deleteDatabase: refuse("deleteDatabase")
  }
}));

// Fail loudly if something bypasses the mock and opens a socket to mongod.
beforeAll(async () => {
  const { MongoClient } = await import("mongodb");
  vi.spyOn(MongoClient, "connect").mockImplementation(refuse("connect") as any);
});
