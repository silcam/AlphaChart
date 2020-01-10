import { ObjectId } from "bson";
import { User } from "./User";
import { AlphabetListing } from "./Alphabet";

export interface Group {
  id: string;
  name: string;
  users: string[];
}

export interface GroupInflated extends Group {
  userObjs: User[];
  alphabetObjs: AlphabetListing[];
}

export interface StoredGroup {
  _id: ObjectId;
  name: string;
  _users: ObjectId[];
}

export function toGroup(sg: StoredGroup): Group {
  return {
    id: sg._id.toHexString(),
    users: sg._users.map(id => id.toHexString()),
    name: sg.name
  };
}

export type NewStoredGroup = Omit<StoredGroup, "_id">;

export interface NewGroup {
  name: string;
}

export function groupCompare(a: Group, b: Group): number {
  return a.name.localeCompare(b.name);
}

// export function toStoredGroup()
