import { StoredGroup, NewStoredGroup } from "../../../client/src/models/Group";
import Data from "./Data";
import log from "../common/log";
import { ObjectId, ObjectID } from "bson";

async function groups(): Promise<StoredGroup[]> {
  log.log(`[Query] READ groups`);
  const collection = await groupCollection();
  return collection.find({}).toArray();
}

async function group(_id: ObjectID): Promise<StoredGroup | null> {
  log.log(`[Query] READ Group ${_id}`);
  const collection = await groupCollection();
  return collection.findOne({ _id });
}

async function groupsByUser(_id: ObjectID): Promise<StoredGroup[]> {
  log.log(`[Query] READ Groups for User ${_id}`);
  const collection = await groupCollection();
  return collection.find({ _users: _id }).toArray();
}

async function createGroup(newGroup: NewStoredGroup): Promise<StoredGroup> {
  log.log(`[Query] CREATE Group ${newGroup.name}`);
  const collection = await groupCollection();
  const result = await collection.insertOne(newGroup as StoredGroup);
  return result.ops[0];
}

async function addUser(
  groupId: ObjectId,
  userId: ObjectId
): Promise<StoredGroup | null> {
  log.log(`[Query] UPDATE Add User ${userId} to group ${groupId}`);
  const collection = await groupCollection();
  await collection.updateOne({ _id: groupId }, { $push: { _users: userId } });
  return collection.findOne({ _id: groupId });
}

async function removeUser(
  groupId: ObjectId,
  userId: ObjectId
): Promise<StoredGroup | null> {
  log.log(`[Query] UPDATE Remove User ${userId} from group ${groupId}.`);
  const collection = await groupCollection();
  await collection.updateOne({ _id: groupId }, { $pull: { _users: userId } });
  return collection.findOne({ _id: groupId });
}

export default {
  groups,
  group,
  groupsByUser,
  createGroup,
  addUser,
  removeUser
};

async function groupCollection() {
  return (await Data.db()).collection<StoredGroup>("groups");
}
