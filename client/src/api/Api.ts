import { CurrentUser, NewUser, LoginAttempt } from "../models/User";
import { Locale } from "../i18n/i18n";
import { Alphabet, DraftAlphabet, AlphabetChart } from "../models/Alphabet";
import { Group, NewGroup } from "../models/Group";
import { LoadAction } from "../state/LoadAction";

export const API_VERSION = 7;
export const OLD_API_STATUS_410 = 410;

export enum APIError {
  EmailInUse = 1001,
  InvalidInput
}

export function apiPath(path: string) {
  return `/api/v/${API_VERSION}${path}`;
}

export type Params = { [key: string]: string | number };

type ApiPayload = Required<LoadAction["payload"]>;

export interface APIGet {
  "/alphabets": [
    {},
    {},
    Pick<ApiPayload, "alphabetListings" | "users" | "groups">
  ];
  "/alphabets/letterIndex": [{}, {}, string[]];
  "/alphabets/byLetter": [
    {},
    { letter: string },
    Pick<ApiPayload, "alphabetListings" | "users" | "groups">
  ];
  "/alphabets/:id": [
    { id: string },
    {},
    Pick<ApiPayload, "alphabets" | "groups" | "users">
  ];
  "/archivedAlphabets/:id": [{ id: string }, {}, Alphabet];
  // "/users": [{}, {}, User[]];
  "/users/current": [
    {},
    {},
    Pick<ApiPayload, "currentUser" | "groups" | "alphabetListings">
  ];
  "/users/search": [{}, { q: string }, Pick<ApiPayload, "users">];
  "/groups": [
    {},
    {},
    Pick<ApiPayload, "alphabetListings" | "users" | "groups">
  ];
  // "/users/:id/groups": [{ id: string }, {}, Group[]];
}

export interface APIPost {
  "/alphabets/:id/copy": [
    { id: string },
    { owner: string; ownerType: "user" | "group" },
    { id: string }
  ];
  "/alphabets/:id/share": [
    { id: string },
    { userId: string },
    Pick<ApiPayload, "alphabets" | "groups" | "users">
  ];
  "/alphabets/:id/unshare": [{ id: string }, { userId: string }, Alphabet];
  "/alphabets": [{}, DraftAlphabet, Alphabet];
  "/alphabets/:id/charts": [{ id: string }, AlphabetChart, Alphabet];
  "/alphabets/:id/update": [
    { id: string },
    { name: string },
    Pick<ApiPayload, "alphabets" | "alphabetListings">
  ];
  "/alphabets/:id/archive": [{ id: string }, {}, { id: string }];
  "/users": [{}, NewUser, null];
  "/users/resendConfirmation": [{}, { email: string }, { email: string }];
  "/users/:id/update": [
    { id: string },
    { name?: string; email?: string },
    Pick<ApiPayload, "users" | "currentUser">
  ];
  "/users/verify": [{}, { verification: string }, CurrentUser];
  "/users/login": [
    {},
    LoginAttempt,
    Pick<ApiPayload, "currentUser" | "groups" | "alphabetListings">
  ];
  "/users/locale": [{}, { locale: Locale }, null];
  "/users/logout": [{}, null, null];
  "/groups": [{}, NewGroup, Group];
  "/groups/:id/update": [
    { id: string },
    { name: string },
    Pick<ApiPayload, "groups">
  ];
  "/groups/:id/addUser": [
    { id: string },
    { id: string },
    Pick<ApiPayload, "alphabetListings" | "users" | "groups">
  ];
  "/groups/:id/removeUser": [
    { id: string },
    { id: string },
    Pick<ApiPayload, "alphabetListings" | "users" | "groups">
  ];
}

export type GetRoute = keyof APIGet;
export type PostRoute = keyof APIPost;
