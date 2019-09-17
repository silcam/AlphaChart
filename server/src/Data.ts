import { MongoClient, Cursor, Collection, ObjectID } from "mongodb";
import {
  DraftAlphabet,
  Alphabet,
  AlphabetChart
} from "../../client/src/alphabet/Alphabet";
import { StoredUser, NewUser } from "../../client/src/alphabet/User";
import update from "immutability-helper";
import { createPassword } from "./password";

type CollectionName = "alphabets" | "users";

async function query<T>(
  collectionName: CollectionName,
  callback: (collection: Collection) => Promise<T>
) {
  const url = "mongodb://localhost:27017";
  const dbName = "alphachart";
  let client: MongoClient | null = null;
  try {
    client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return callback(collection);
  } finally {
    if (client) client.close();
  }
}

async function alphabets(): Promise<Alphabet[]> {
  console.log("[Query] READ Alphabets");
  const alphabets = await query("alphabets", async collection => {
    const abCursor: Cursor<Alphabet> = collection.find({});
    return abCursor.map(ab => ({ ...ab, charts: [] })).toArray();
  });
  return alphabets;
}

async function alphabet(id: string): Promise<Alphabet | null> {
  console.log(`[Query] READ Alphabet ${id}`);
  return query("alphabets", async collection => {
    return collection.findOne({ _id: new ObjectID(id) });
  });
}

async function createAlphabet(draftAlphabet: DraftAlphabet): Promise<Alphabet> {
  console.log("[Query] CREATE Alphabet");
  const alphabet: Omit<Alphabet, "_id"> = {
    name: draftAlphabet.name,
    charts: [
      update(draftAlphabet.chart, { timestamp: { $set: Date.now().valueOf() } })
    ]
  };
  return query("alphabets", async collection => {
    const result = await collection.insertOne(alphabet);
    return result.ops[0];
  });
}

async function createChart(
  abId: string,
  chart: AlphabetChart
): Promise<Alphabet> {
  console.log(`[Query] Create Chart for Alphabet ${abId}`);
  const finalChart = update(chart, {
    timestamp: { $set: Date.now().valueOf() }
  });
  return query("alphabets", async collection => {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectID(abId) },
      {
        $push: {
          charts: {
            $each: [finalChart],
            $position: 0
          }
        }
      },
      { returnOriginal: false }
    );
    return result.value;
  });
}

async function user(email: string): Promise<StoredUser | null> {
  console.log(`[Query] READ User ${email}`);
  return query("users", async collection => {
    return collection.findOne({ email });
  });
}

async function createUser(user: NewUser) {
  console.log("[Query] CREATE User");
  const passwordParams = createPassword(user.password);
  const storedUser: StoredUser = {
    _id: user.email,
    name: user.name,
    email: user.email,
    passwordHash: passwordParams.hash,
    passwordSalt: passwordParams.salt
  };
  return query("users", async collection => {
    const result = await collection.insertOne(storedUser);
    return result.ops[0];
  });
}

export default {
  alphabets,
  alphabet,
  createAlphabet,
  createChart,
  createUser,
  user
};
