import { StoredUser, NewUser } from "../../../client/src/models/User";
import { createPassword } from "../common/password";
import Data from "./Data";
import log from "../common/log";

async function users(): Promise<StoredUser[]> {
  log.log(`[Query] READ Users`);
  const collection = await userCollection();
  return collection.find({}).toArray();
}

async function user(email: string): Promise<StoredUser | null> {
  log.log(`[Query] READ User ${email}`);
  const collection = await userCollection();
  return collection.findOne({ _id: email });
}

async function createUser(user: NewUser) {
  log.log("[Query] CREATE User");
  const passwordParams = createPassword(user.password);
  if (!user.name) user.name = user.email.replace(/@.*/, ""); // This should be in User.ts
  const storedUser: StoredUser = {
    _id: user.email,
    name: user.name,
    email: user.email,
    passwordHash: passwordParams.hash,
    passwordSalt: passwordParams.salt
  };
  const collection = await userCollection();
  const result = await collection.insertOne(storedUser);
  return result.ops[0];
}

async function update(user: StoredUser) {
  log.log(`[Query] UPDATE User ${user._id}`);
  const collection = await userCollection();
  const result = await collection.replaceOne({ _id: user._id }, user);
}

async function userCollection() {
  return (await Data.db()).collection<StoredUser>("users");
}

export default {
  users,
  user,
  createUser,
  update
};
