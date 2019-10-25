import { TKey } from "../locales/en";

export interface NewUser {
  email: string;
  name: string;
  password: string;
}

export interface User {
  name: string;
}

export interface CurrentUser extends User {
  email: string;
}

export type CurrentUserOrNot = CurrentUser | null;

export interface StoredUser extends CurrentUser {
  _id: string;
  passwordHash: string;
  passwordSalt: string;
}

export interface LoginAttempt {
  email: string;
  password: string;
}

export function toPublicUser(user: StoredUser): User {
  return {
    name: user.name
  };
}

export function toCurrentUser(user: StoredUser): CurrentUser {
  return {
    name: user.name,
    email: user.email
  };
}

export function validationErrors(user: NewUser, passwordCheck?: string) {
  const errors: TKey[] = [];
  if (user.email.length < 5) errors.push("Invalid_email");
  if (user.password.length < 10) errors.push("Password_too_short");
  if (passwordCheck !== undefined && passwordCheck !== user.password)
    errors.push("Passwords_do_not_match");
  return errors.length > 0 ? errors : null;
}

export function userId(user: CurrentUserOrNot) {
  return user && user.email;
}
