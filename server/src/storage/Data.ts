import { MongoClient, Db } from "mongodb";
import nodeCleanup from "node-cleanup";
import fixtures from "./fixtures";
import log from "../common/log";

const PORT = 27017;
const URL = `mongodb://localhost:${PORT}`;
let CLIENT: MongoClient | null = null;
let DB: Db | null = null;

async function db(): Promise<Db> {
  if (!DB) {
    const dbName = databaseName();
    log.log(`Connecting to Mongo db: ${dbName}`);
    CLIENT = await MongoClient.connect(URL, { useNewUrlParser: true });
    DB = await CLIENT.db(dbName);
  }
  return DB;
}

function databaseName() {
  switch (process.env.NODE_ENV) {
    case "test":
      return `acTest-${Date.now().valueOf()}-${Math.floor(
        Math.random() * 1000
      )}`;
    case "test-cypress":
      return "alphachart-cypress";
    default:
      return "alphachart";
  }
}

nodeCleanup(() => {
  if (CLIENT) CLIENT.close();
});

async function loadFixtures() {
  const database = await db();
  const collections = Object.keys(fixtures) as (keyof typeof fixtures)[];
  for (let i = 0; i < collections.length; ++i) {
    const key = collections[i];
    const collection = await database.createCollection(key);
    if (key == "users") collection.createIndex({ email: "text", name: "text" });
    await collection.deleteMany({});
    await collection.insertMany(fixtures[key]);
  }
}

async function deleteDatabase() {
  if (!(process.env.NODE_ENV === "test")) return;
  if (!DB) return;
  DB.dropDatabase();
}

export default {
  db,
  loadFixtures,
  deleteDatabase
};
