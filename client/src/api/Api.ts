import { CurrentUser, NewUser, LoginAttempt, User } from "../models/User";
import { Locale } from "../i18n/i18n";
import { Alphabet, DraftAlphabet, AlphabetChart } from "../models/Alphabet";
import { Group, NewGroup } from "../models/Group";
import { LoadAction } from "../state/LoadAction";

export const API_VERSION = 7;
export const OLD_API_STATUS_410 = 410;

export enum APIError {
  EmailInUse = 1001,
  InvalidInput,
  BadPassword,
  NoSuchEmail
}

export function apiPath(path: string) {
  return `/api/v/${API_VERSION}${path}`;
}

export type Params = { [key: string]: string | number };

type ApiPayload = Required<LoadAction["payload"]>;
type AlphabetPayload = Pick<
  ApiPayload,
  "alphabetListings" | "users" | "groups"
>;

export interface APIGet {
  "/alphabets": [{}, {}, AlphabetPayload];
  "/alphabets/mine": [{}, {}, AlphabetPayload];
  "/alphabets/quality": [{}, {}, AlphabetPayload];
  "/alphabets/letterIndex": [{}, {}, string[]];
  "/alphabets/byLetter": [{}, { letter: string }, AlphabetPayload];
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
  "/users/passwordReset/:key": [{ key: string }, {}, User];
  "/users/search": [{}, { q: string }, Pick<ApiPayload, "users">];
  "/groups": [{}, {}, AlphabetPayload];
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
  "/users/resetPassword": [{}, { email: string }, { success: boolean }];
  "/users/:id/changePassword": [
    { id: string },
    (
      | { password: string; newPassword: string }
      | { resetKey: string; newPassword: string }
    ),
    { success: boolean }
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
  "/groups/:id/addUser": [{ id: string }, { id: string }, AlphabetPayload];
  "/groups/:id/removeUser": [{ id: string }, { id: string }, AlphabetPayload];
}

export type GetRoute = keyof APIGet;
export type PostRoute = keyof APIPost;
