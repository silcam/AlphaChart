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

export interface StoredUser extends CurrentUser {
  _id: string;
  passwordHash: string;
  passwordSalt: string;
}

export interface LoginAttempt {
  email: string;
  password: string;
}

export function publicUser(user: StoredUser): User {
  return {
    name: user.name
  };
}

export function currentUser(user: StoredUser): CurrentUser {
  return {
    name: user.name,
    email: user.email
  };
}

export function validationErrors(user: NewUser, passwordCheck?: string) {
  const errors = [];
  if (user.email.length < 5) errors.push("Email is invalid.");
  if (user.password.length < 10)
    errors.push("Please choose a password with at least 10 characters.");
  if (passwordCheck !== undefined && passwordCheck !== user.password)
    errors.push("Passwords do not match.");
  return errors.length > 0 ? errors : null;
}
