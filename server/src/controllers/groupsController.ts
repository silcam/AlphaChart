import { Express } from "express";
import { addGetHandler, addPostHandler } from "./serverApi";
import GroupData from "../storage/GroupData";
import {
  toGroup,
  NewGroup,
  NewStoredGroup,
  StoredGroup
} from "../../../client/src/models/Group";
import { currentUserStrict, getById } from "./controllerHelper";
import { ObjectID } from "mongodb";
import UserData from "../storage/UserData";
import { flat } from "../../../client/src/util/arrayUtils";
import AlphabetData from "../storage/AlphabetData";
import { toAlphabet } from "../../../client/src/models/Alphabet";
import { toPublicUser } from "../../../client/src/models/User";

export default function groupsController(app: Express) {
  addGetHandler(app, "/groups", async req => {
    const groups = await GroupData.groups();
    return groupResponse(groups);
  });

  addPostHandler(app, "/groups", async req => {
    const newGroup: NewGroup = req.body;
    const user = await currentUserStrict(req);
    const newStoredGroup: NewStoredGroup = { ...newGroup, _users: [user._id] };
    const group = await GroupData.createGroup(newStoredGroup);
    return toGroup(group);
  });

  addPostHandler(app, "/groups/:id/update", async req => {
    const group = await getById(req.params.id, GroupData.group);
    await currentUserStrict(req, group._users);
    const name: string = req.body.name;
    const grpUpdate = { name };
    const newStoredGroup = await GroupData.updateGroup(group._id, grpUpdate);
    if (!newStoredGroup) throw { status: 500 };
    return { groups: [toGroup(newStoredGroup)] };
  });

  addPostHandler(app, "/groups/:id/addUser", async req => {
    const group = await getById(req.params.id, GroupData.group);
    const newUser = await getById(req.body.id, UserData.user);
    await currentUserStrict(req, group._users);

    const newGroup = await GroupData.addUser(group._id, newUser._id);
    if (!newGroup) throw { status: 500 };
    return groupResponse([newGroup]);
  });

  addPostHandler(app, "/groups/:id/removeUser", async req => {
    const group = await getById(req.params.id, GroupData.group);
    const removeUserId = new ObjectID(req.body.id);
    await currentUserStrict(req, group._users);

    const newGroup = await GroupData.removeUser(group._id, removeUserId);
    if (!newGroup) throw { status: 500 };
    return groupResponse([newGroup]);
  });
}

async function groupResponse(groups: StoredGroup[]) {
  return {
    groups: groups.map(toGroup),
    users: (await UserData.users(flat(groups.map(g => g._users)))).map(
      toPublicUser
    ),
    alphabetListings: (
      await AlphabetData.alphabetsByGroup(groups.map(g => g._id))
    ).map(toAlphabet)
  };
}
