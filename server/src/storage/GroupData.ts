import { StoredGroup, NewStoredGroup } from "../../../client/src/models/Group";
import Data from "./Data";
import log from "../common/log";
import { ObjectId, ObjectID } from "bson";

async function groups(_ids?: ObjectID[]): Promise<StoredGroup[]> {
  log.log(`[Query] READ groups`);
  const collection = await groupCollection();
  const query = _ids ? { _id: { $in: _ids } } : {};
  return collection.find(query).toArray();
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

async function updateGroup(
  _id: ObjectID,
  update: Partial<StoredGroup>
): Promise<StoredGroup | null> {
  log.log(`[Query] UPDATE group ${_id}`);
  const collection = await groupCollection();
  await collection.updateOne({ _id }, { $set: update });
  return collection.findOne({ _id });
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
  updateGroup,
  addUser,
  removeUser
};

async function groupCollection() {
  return (await Data.db()).collection<StoredGroup>("groups");
}
