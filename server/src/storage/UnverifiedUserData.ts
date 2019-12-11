import Data from "./Data";
import {
  UnverifiedUser,
  NewUnverifiedUser
} from "../../../client/src/models/User";
import log from "../common/log";

async function create(user: NewUnverifiedUser): Promise<UnverifiedUser> {
  log.log(`[Query] CREATE Unverified User ${user.email}`);
  const collection = await unverfiedUserCollection();
  const result = await collection.insertOne(user as UnverifiedUser);
  return result.ops[0];
}

async function find(verification: string) {
  log.log(`[Query] READ Unverified User verification: ${verification}`);
  const collection = await unverfiedUserCollection();
  return collection.findOne({ verification });
}

async function findByEmail(email: string): Promise<UnverifiedUser[]> {
  log.log(`[Query] READ Unverified User by Email: ${email}`);
  const collection = await unverfiedUserCollection();
  return collection.find({ email }).toArray();
}

async function remove(verification: string) {
  log.log(`[Query] DELETE Unverified User verification: ${verification}`);
  const collection = await unverfiedUserCollection();
  collection.deleteOne({ verification });
}

async function removeOld(timestamp: number) {
  log.log(`[Query] DELETE Unverified Users older than: ${timestamp}`);
  const collection = await unverfiedUserCollection();
  collection.deleteMany({ created: { $lt: timestamp } });
}

async function unverfiedUserCollection() {
  return (await Data.db()).collection<UnverifiedUser>("unverifiedUsers");
}

export default {
  create,
  find,
  findByEmail,
  remove,
  removeOld
};
