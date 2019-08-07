import { MongoClient, Db } from "mongodb";
import { DraftAlphabet, Alphabet } from "../../client/src/alphabet/Alphabet";
import update from "immutability-helper";

async function query<T>(callback: (db: Db) => Promise<T>) {
  const url = "mongodb://localhost:27017";
  const dbName = "alphachart";
  let client: MongoClient | null = null;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    return callback(db);
  } catch (err) {
    console.error(err);
  } finally {
    if (client) client.close();
  }
}

async function alphabets(): Promise<Alphabet[]> {
  const alphabets = await query(async db => {
    const collection = db.collection("alphabets");
    return collection.find({}).toArray();
  });
  return alphabets ? alphabets : [];
}

async function createAlphabet(draftAlphabet: DraftAlphabet) {
  console.log("[Query] CREATE ALPHABET");
  const alphabet: Alphabet = {
    _id: Date.now().valueOf(),
    name: draftAlphabet.name,
    charts: [
      update(draftAlphabet.chart, { timestamp: { $set: Date.now().valueOf() } })
    ]
  };
  return query(async db => {
    const collection = db.collection("alphabets");
    await collection.insertOne(alphabet);
  });
}

export default {
  alphabets,
  createAlphabet
};
