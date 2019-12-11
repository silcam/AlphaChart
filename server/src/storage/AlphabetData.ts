import Data from "./Data";
import {
  StoredAlphabet,
  DraftAlphabet,
  AlphabetChart,
  AlphabetListing,
  toAlphabet
} from "../../../client/src/models/Alphabet";
import { Collection } from "mongodb";
import { ObjectID } from "bson";
import update from "immutability-helper";
import { StoredUser } from "../../../client/src/models/User";
import UserData from "./UserData";
import log from "../common/log";
import { byId } from "../common/ArrayUtils";

async function alphabets(user?: StoredUser): Promise<AlphabetListing[]> {
  log.log("[Query] READ Alphabets");
  const collection = await alphabetCollection();
  const usersById = byId(await UserData.users(), "_id");
  const findParam = user ? { _user: user._id } : {};
  return collection
    .find(findParam, { projection: { chart: 0 } })
    .map(alphabet => ({
      ...toAlphabet(alphabet),
      userDisplayName: usersById[`${alphabet._user}`].name
    }))
    .toArray();
}

async function alphabet(id: string): Promise<StoredAlphabet | null> {
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
): Promise<StoredAlphabet> {
  log.log("[Query] CREATE Alphabet");
  const alphabet: Omit<StoredAlphabet, "_id"> = {
    name: draftAlphabet.name,
    _user: user._id,
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
  user: StoredUser
): Promise<StoredAlphabet> {
  log.log(`[Query] Copy chart ${alphabet._id} to user ${user._id}`);
  const newAlphabet: Omit<StoredAlphabet, "_id"> = update(alphabet, {
    _user: { $set: user._id },
    $unset: ["_id"]
  });
  const collection = await alphabetCollection();
  const result = await collection.insertOne(newAlphabet as StoredAlphabet);
  return result.ops[0];
}

async function alphabetCollection(): Promise<Collection<StoredAlphabet>> {
  return (await Data.db()).collection("alphabets");
}

export default {
  alphabet,
  alphabets,
  createAlphabet,
  updateChart,
  copyAlphabet
};
