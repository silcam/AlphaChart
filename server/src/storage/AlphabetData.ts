import Data from "./Data";
import {
  StoredAlphabet,
  DraftAlphabet,
  AlphabetChart,
  StoredAlphabetListing
} from "../../../client/src/models/Alphabet";
import { Collection } from "mongodb";
import { ObjectID, ObjectId } from "bson";
import update from "immutability-helper";
import log from "../common/log";

async function alphabets(): Promise<StoredAlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  return collection.find({}, { projection: { chart: 0 } }).toArray();
}

async function alphabetNames(): Promise<string[]> {
  log.log("[Query] READ Alphabet names");
  const collection = await alphabetCollection();
  return collection
    .find({}, { projection: { name: 1 } })
    .map(alph => alph.name)
    .toArray();
}

async function alphabetsByNamePattern(
  pattern: RegExp
): Promise<StoredAlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  return collection
    .find({ name: { $regex: pattern } }, { projection: { chart: 0 } })
    .toArray();
}

async function alphabetsByGroup(
  groupIds: ObjectID[]
): Promise<StoredAlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  return collection
    .find(
      { ownerType: "group", _owner: { $in: groupIds } },
      { projection: { chart: 0 } }
    )
    .toArray();
}

async function alphabetsByUser(
  userId: ObjectID
): Promise<StoredAlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  return collection
    .find({ $or: [{ ownerType: "user", _owner: userId }, { _users: userId }] })
    .toArray();
}

async function alphabetsByUserOrGroup(
  userId: ObjectID,
  groupIds: ObjectID[]
): Promise<StoredAlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  return collection
    .find({
      $or: [
        { ownerType: "user", _owner: userId },
        { _users: userId },
        { ownerType: "group", _owner: { $in: groupIds } }
      ]
    })
    .toArray();
}

/*
  Warning - The filter function must work after being converted to string 
  and then executed by Mongo! 
*/
async function alphabetsByFilter(
  filter: (this: StoredAlphabet) => boolean
): Promise<StoredAlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  return collection
    .find(
      {
        $where: filter.toString()
      },
      { projection: { chart: 0 } }
    )
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

async function updateAlphabet(
  _id: ObjectId,
  mergeAlphabet: Partial<StoredAlphabet>
): Promise<StoredAlphabet | null> {
  log.log(`[Query] UPDATE alphabet ${_id}`);
  const collection = await alphabetCollection();
  await collection.updateOne({ _id }, { $set: mergeAlphabet });
  return collection.findOne({ _id });
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

async function unshareAlphabet(
  alphabetId: ObjectId,
  userId: ObjectId
): Promise<StoredAlphabet | null> {
  log.log(`[Query] UPDATE Unshare chart ${alphabetId} with user ${userId}`);
  const collection = await alphabetCollection();
  await collection.updateOne(
    { _id: alphabetId },
    { $pull: { _users: userId } }
  );
  return collection.findOne({ _id: alphabetId });
}

async function archive(_id: ObjectId): Promise<void> {
  log.log(`[Query] DELETE Archive alphabet ${_id}`);
  const alphabets = await alphabetCollection();
  const archivedAlphabets = await archivedCollection();
  const alphabet = await alphabets.findOne({ _id });
  if (!alphabet) return;

  archivedAlphabets.insertOne(alphabet);
  alphabets.deleteOne({ _id });
}

async function getArchived(_id: ObjectId): Promise<StoredAlphabet | null> {
  log.log(`[Query] READ Archived Alphabet ${_id}`);
  const collection = await archivedCollection();
  return collection.findOne({ _id });
}

async function alphabetCollection(): Promise<Collection<StoredAlphabet>> {
  return (await Data.db()).collection("alphabets");
}

async function archivedCollection(): Promise<Collection<StoredAlphabet>> {
  return (await Data.db()).collection("archivedAlphabets");
}

export default {
  alphabet,
  alphabets,
  alphabetNames,
  alphabetsByNamePattern,
  alphabetsByGroup,
  alphabetsByUser,
  alphabetsByUserOrGroup,
  alphabetsByFilter,
  createAlphabet,
  updateAlphabet,
  updateChart,
  copyAlphabet,
  shareAlphabet,
  unshareAlphabet,
  archive,
  getArchived
};
