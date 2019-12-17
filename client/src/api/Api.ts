import { CurrentUser, NewUser, LoginAttempt, User } from "../models/User";
import { Locale } from "../i18n/i18n";
import {
  AlphabetListing,
  Alphabet,
  DraftAlphabet,
  AlphabetChart
} from "../models/Alphabet";
import { Group, NewGroup } from "../models/Group";

export const API_VERSION = 7;
export const OLD_API_STATUS_410 = 410;

export function apiPath(path: string) {
  return `/api/v/${API_VERSION}${path}`;
}

export type Params = { [key: string]: string | number };

export interface APIGet {
  "/alphabets": [{}, {}, AlphabetListing[]];
  "/alphabets/mine": [{}, {}, AlphabetListing[]];
  "/alphabets/:id": [{ id: string }, {}, Alphabet];
  "/users": [{}, {}, User[]];
  "/users/current": [{}, {}, CurrentUser | { locale: Locale }];
  "/users/search": [{}, { q: string }, User[]];
  "/groups": [{}, {}, Group[]];
  "/users/:id/groups": [{ id: string }, {}, Group[]];
}

export interface APIPost {
  "/alphabets/:id/copy": [
    { id: string },
    { owner: string; ownerType: "user" | "group" },
    { id: string }
  ];
  "/alphabets/:id/share": [{ id: string }, { userId: string }, Alphabet];
  "/alphabets": [{}, DraftAlphabet, Alphabet];
  "/alphabets/:id/charts": [{ id: string }, AlphabetChart, Alphabet];
  "/users": [{}, NewUser, null];
  "/users/verify": [{}, { verification: string }, CurrentUser];
  "/users/login": [{}, LoginAttempt, CurrentUser];
  "/users/locale": [{}, { locale: Locale }, null];
  "/users/logout": [{}, null, null];
  "/groups": [{}, NewGroup, Group];
  "/groups/:id/addUser": [{ id: string }, { id: string }, Group];
  "/groups/:id/removeUser": [{ id: string }, { id: string }, Group];
}

export type GetRoute = keyof APIGet;
export type PostRoute = keyof APIPost;
