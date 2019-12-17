import Data from "./Data";
import {
  StoredAlphabet,
  DraftAlphabet,
  AlphabetChart,
  AlphabetListing,
  toAlphabet
} from "../../../client/src/models/Alphabet";
import { Collection } from "mongodb";
import { ObjectID, ObjectId } from "bson";
import update from "immutability-helper";
import log from "../common/log";

async function alphabets(): Promise<AlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  return collection
    .find({}, { projection: { chart: 0 } })
    .map(toAlphabet)
    .toArray();
}

async function alphabet(_id: ObjectId): Promise<StoredAlphabet | null> {
  log.log(`[Query] READ Alphabet ${_id}`);
  const collection = await alphabetCollection();
  try {
    return collection.findOne({ _id });
  } catch (err) {
    return null;
  }
}

async function createAlphabet(
  draftAlphabet: DraftAlphabet
): Promise<StoredAlphabet> {
  log.log("[Query] CREATE Alphabet");
  const { owner, ...draft } = draftAlphabet;
  const alphabet: Omit<StoredAlphabet, "_id"> = {
    ...draft,
    _owner: new ObjectID(owner),
    _users: [],
    chart: update(draftAlphabet.chart, {
      timestamp: { $set: Date.now().valueOf() }
    })
  };
  const collection = await alphabetCollection();
  const result = await collection.insertOne(alphabet as StoredAlphabet);
  return result.ops[0];
}

async function updateChart(
  abId: string,
  chart: AlphabetChart
): Promise<StoredAlphabet | undefined> {
  log.log(`[Query] Update Chart for Alphabet ${abId}`);
  const finalChart = update(chart, {
    timestamp: { $set: Date.now().valueOf() }
  });
  const collection = await alphabetCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectID(abId) },
    {
      $set: {
        chart: finalChart
      }
    },
    { returnOriginal: false }
  );
  return result.value;
}

async function copyAlphabet(
  alphabet: StoredAlphabet,
  _owner: ObjectId,
  ownerType: "user" | "group"
): Promise<StoredAlphabet> {
  log.log(`[Query] Copy chart ${alphabet._id} to ${ownerType} ${_owner}`);
  const newAlphabet: Omit<StoredAlphabet, "_id"> = update(alphabet, {
    $merge: { _owner, ownerType, _users: [] },
    $unset: ["_id"]
  });
  const collection = await alphabetCollection();
  const result = await collection.insertOne(newAlphabet as StoredAlphabet);
  return result.ops[0];
}

async function shareAlphabet(
  alphabetId: ObjectId,
  userId: ObjectId
): Promise<StoredAlphabet | null> {
  log.log(`[Query] UPDATE Share chart ${alphabetId} with user ${userId}`);
  const collection = await alphabetCollection();
  await collection.updateOne(
    { _id: alphabetId },
    { $push: { _users: userId } }
  );
  return collection.findOne({ _id: alphabetId });
}

async function alphabetCollection(): Promise<Collection<StoredAlphabet>> {
  return (await Data.db()).collection("alphabets");
}

export default {
  alphabet,
  alphabets,
  createAlphabet,
  updateChart,
  copyAlphabet,
  shareAlphabet
};
