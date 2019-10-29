import Data from "./Data";
import {
  Alphabet,
  DraftAlphabet,
  AlphabetChart,
  AlphabetListing
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
  const findParam = user ? { user: user._id } : {};
  return collection
    .find(findParam, { projection: { chart: 0 } })
    .map(alphabet => ({
      ...alphabet,
      userDisplayName: usersById[alphabet.user].name
    }))
    .toArray();
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
    chart: update(draftAlphabet.chart, {
      timestamp: { $set: Date.now().valueOf() }
    })
  };
  const collection = await alphabetCollection();
  const result = await collection.insertOne(alphabet as Alphabet);
  return result.ops[0];
}

async function updateChart(
  abId: string,
  chart: AlphabetChart
): Promise<Alphabet | undefined> {
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
  alphabet: Alphabet,
  user: StoredUser
): Promise<Alphabet> {
  log.log(`[Query] Copy chart ${alphabet._id} to user ${user._id}`);
  const newAlphabet: Omit<Alphabet, "_id"> = update(alphabet, {
    user: { $set: user._id },
    $unset: ["_id"]
  });
  const collection = await alphabetCollection();
  const result = await collection.insertOne(newAlphabet as Alphabet);
  return result.ops[0];
}

async function alphabetCollection(): Promise<Collection<Alphabet>> {
  return (await Data.db()).collection("alphabets");
}

export default {
  alphabet,
  alphabets,
  createAlphabet,
  updateChart,
  copyAlphabet
};
