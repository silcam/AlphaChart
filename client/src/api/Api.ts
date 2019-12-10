import { CurrentUser, NewUser, LoginAttempt } from "../models/User";
import { Locale } from "../i18n/i18n";
import {
  AlphabetListing,
  Alphabet,
  DraftAlphabet,
  AlphabetChart
} from "../models/Alphabet";

export const API_VERSION = 6;
export const OLD_API_STATUS_410 = 410;

export function apiPath(path: string) {
  return `/api/v/${API_VERSION}${path}`;
}

export type Params = { [key: string]: string | number };

export interface APIGet {
  "/alphabets": [{}, AlphabetListing[]];
  "/alphabets/mine": [{}, AlphabetListing[]];
  "/alphabets/:id": [{ id: string }, Alphabet];
  "/users/current": [{}, CurrentUser | { locale: Locale }];
}

export interface APIPost {
  "/alphabets/:id/copy": [{ id: string }, null, { _id: string }];
  "/alphabets": [{}, DraftAlphabet, Alphabet];
  "/alphabets/:id/charts": [{ id: string }, AlphabetChart, Alphabet];
  "/users": [{}, NewUser, null];
  "/users/verify": [{}, { verification: string }, CurrentUser];
  "/users/login": [{}, LoginAttempt, CurrentUser];
  "/users/locale": [{}, { locale: Locale }, null];
  "/users/logout": [{}, null, null];
}

export type GetRoute = keyof APIGet;
export type PostRoute = keyof APIPost;
