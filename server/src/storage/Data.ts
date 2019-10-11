import { MongoClient, Db } from "mongodb";
import nodeCleanup from "node-cleanup";
import fixtures from "./fixtures";

const PORT = 27017;
const URL = `mongodb://localhost:${PORT}`;
let CLIENT: MongoClient | null = null;
let DB: Db | null = null;

async function db(): Promise<Db> {
  if (!DB) {
    const dbName =
      process.env.NODE_ENV === "test"
        ? `acTest-${Date.now().valueOf()}-${Math.floor(Math.random() * 1000)}`
        : "alphachart";
    CLIENT = await MongoClient.connect(URL, { useNewUrlParser: true });
    DB = await CLIENT.db(dbName);
  }
  return DB;
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
