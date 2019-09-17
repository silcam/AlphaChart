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
