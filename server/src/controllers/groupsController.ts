import { Express } from "express";
import { addGetHandler, addPostHandler } from "./serverApi";
import GroupData from "../storage/GroupData";
import {
  toGroup,
  NewGroup,
  NewStoredGroup,
  StoredGroup
} from "../../../client/src/models/Group";
import { currentUser } from "./controllerHelper";
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
    const user = await currentUser(req);
    if (!user) throw { status: 401 };

    const newStoredGroup: NewStoredGroup = { ...newGroup, _users: [user._id] };
    const group = await GroupData.createGroup(newStoredGroup);
    return toGroup(group);
  });

  addPostHandler(app, "/groups/:id/addUser", async req => {
    const user = await currentUser(req);
    const group = await GroupData.group(new ObjectID(req.params.id));
    const newUser = await UserData.user(new ObjectID(req.body.id));

    if (!group || !newUser) throw { status: 404 };
    if (!user || !group._users.some(id => id.equals(user._id)))
      throw { status: 401 };

    const newGroup = await GroupData.addUser(group._id, newUser._id);
    if (!newGroup) throw { status: 500 };
    return groupResponse([newGroup]);
  });

  addPostHandler(app, "/groups/:id/removeUser", async req => {
    const user = await currentUser(req);
    const group = await GroupData.group(new ObjectID(req.params.id));
    const removeUserId = new ObjectID(req.body.id);

    if (!group) throw { status: 404 };
    if (!user || !group._users.some(id => id.equals(user._id)))
      throw { status: 401 };

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
