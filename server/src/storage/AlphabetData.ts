import Data from "./Data";
import {
  Alphabet,
  DraftAlphabet,
  AlphabetChart
} from "../../../client/src/models/Alphabet";
import { Cursor } from "mongodb";
import { ObjectID } from "bson";
import update from "immutability-helper";
import { StoredUser } from "../../../client/src/models/User";
import log from "../common/log";

async function alphabets(user?: StoredUser): Promise<Alphabet[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  const findParam = user ? { user: user._id } : {};
  const abCursor: Cursor<Alphabet> = collection.find(findParam);
  return abCursor.map(ab => ({ ...ab, charts: [] })).toArray();
}

async function alphabet(id: string): Promise<Alphabet | null> {
  log.log(`[Query] READ Alphabet ${id}`);
  const collection = await alphabetCollection();
  try {
    return collection.findOne({ _id: new ObjectID(id) });
  } catch (err) {
    return null;
  }
}

async function createAlphabet(
  draftAlphabet: DraftAlphabet,
  user: StoredUser
): Promise<Alphabet> {
  log.log("[Query] CREATE Alphabet");
  const alphabet: Omit<Alphabet, "_id"> = {
    name: draftAlphabet.name,
    user: user.email,
    charts: [
      update(draftAlphabet.chart, { timestamp: { $set: Date.now().valueOf() } })
    ]
  };
  const collection = await alphabetCollection();
  const result = await collection.insertOne(alphabet);
  return result.ops[0];
}

async function createChart(
  abId: string,
  chart: AlphabetChart
): Promise<Alphabet> {
  log.log(`[Query] Create Chart for Alphabet ${abId}`);
  const finalChart = update(chart, {
    timestamp: { $set: Date.now().valueOf() }
  });
  const collection = await alphabetCollection();
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
}

async function alphabetCollection() {
  return (await Data.db()).collection("alphabets");
}

export default {
  alphabet,
  alphabets,
  createAlphabet,
  createChart
};
