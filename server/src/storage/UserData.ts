import { StoredUser, NewStoredUser } from "../../../client/src/models/User";
import Data from "./Data";
import log from "../common/log";
import { ObjectId } from "bson";

async function users(): Promise<StoredUser[]> {
  log.log(`[Query] READ Users`);
  const collection = await userCollection();
  return collection.find({}).toArray();
}

async function user(_id: ObjectId): Promise<StoredUser | null> {
  log.log(`[Query] READ User ${_id}`);
  const collection = await userCollection();
  return collection.findOne({ _id });
}

async function userByEmail(email: string): Promise<StoredUser | null> {
  log.log(`[Query] READ User ${email}`);
  const collection = await userCollection();
  return collection.findOne({ email });
}

async function createUser(user: NewStoredUser): Promise<StoredUser> {
  log.log("[Query] CREATE User");
  const collection = await userCollection();
  const result = await collection.insertOne(user as StoredUser);
  return result.ops[0];
}

async function update(user: StoredUser) {
  log.log(`[Query] UPDATE User ${user._id}`);
  const collection = await userCollection();
  const result = await collection.replaceOne({ _id: user._id }, user);
}

async function search(query: string): Promise<StoredUser[]> {
  log.log(`[Query] SEARCH Users for ${query}`);
  const collection = await userCollection();
  return collection.find({ $text: { $search: query } }).toArray();
}

async function userCollection() {
  return (await Data.db()).collection<StoredUser>("users");
}

export default {
  users,
  user,
  userByEmail,
  createUser,
  update,
  search
};
