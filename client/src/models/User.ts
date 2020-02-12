import { TKey } from "../i18n/i18n";
import { Locale } from "../i18n/i18n";
import { ObjectId } from "bson";

export interface NewUser {
  email: string;
  name: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
}

export interface CurrentUser extends User {
  email: string;
  locale?: Locale;
}

export type CurrentUserOrNot = CurrentUser | null;

export interface StoredUser extends Omit<CurrentUser, "id"> {
  _id: ObjectId;
  passwordHash: string;
  passwordSalt: string;
  passwordResetKey?: string;
}
export type NewStoredUser = Omit<StoredUser, "_id">;

export interface LoginAttempt {
  email: string;
  password: string;
}

export interface UnverifiedUser extends StoredUser {
  verification: string;
  created: number;
}
export type NewUnverifiedUser = Omit<UnverifiedUser, "_id">;

export function toPublicUser(user: StoredUser): User {
  return {
    id: `${user._id}`,
    name: user.name
  };
}

export function toCurrentUser(user: StoredUser): CurrentUser {
  return {
    id: `${user._id}`,
    name: user.name,
    email: user.email,
    locale: user.locale
  };
}

export function isCurrentUser(user: any): user is CurrentUser {
  return typeof user.name === "string" && typeof user.email === "string";
}

export function validationErrors(user: NewUser, passwordCheck?: string) {
  const errors: TKey[] = [];
  if (!validEmail(user.email)) errors.push("Invalid_email");
  if (!validPassword(user.password)) errors.push("Password_too_short");
  if (passwordCheck !== undefined && passwordCheck !== user.password)
    errors.push("Passwords_do_not_match");
  return errors.length > 0 ? errors : null;
}

export function validEmail(email: string) {
  return email.length >= 5;
}

export function validPassword(password: string) {
  return password.length >= 10;
}

export function userId(user: CurrentUserOrNot) {
  return user && user.id;
}
