import Data from "./Data";
import {
  Alphabet,
  DraftAlphabet,
  AlphabetChart
} from "../../../client/src/models/Alphabet";
import { Cursor } from "mongodb";
import { ObjectID } from "bson";
import update from "immutability-helper";

async function alphabets(): Promise<Alphabet[]> {
  console.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  const abCursor: Cursor<Alphabet> = collection.find({});
  return abCursor.map(ab => ({ ...ab, charts: [] })).toArray();
}

async function alphabet(id: string): Promise<Alphabet | null> {
  console.log(`[Query] READ Alphabet ${id}`);
  const collection = await alphabetCollection();
  return collection.findOne({ _id: new ObjectID(id) });
}

async function createAlphabet(draftAlphabet: DraftAlphabet): Promise<Alphabet> {
  console.log("[Query] CREATE Alphabet");
  const alphabet: Omit<Alphabet, "_id"> = {
    name: draftAlphabet.name,
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
  console.log(`[Query] Create Chart for Alphabet ${abId}`);
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
