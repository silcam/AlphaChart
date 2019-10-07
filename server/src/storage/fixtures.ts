import { createPassword } from "../common/password";

const users = [
  {
    name: "Titus",
    email: "titus@yahoo.com",
    _id: "titus@yahoo.com",
    password: "minecraft"
  }
];

const dbUsers = users.map(user => {
  const { password, ...dbUser } = user;
  const { hash, salt } = createPassword(password);
  return { ...dbUser, passwordHash: hash, passwordSalt: salt };
});

export default {
  users: dbUsers
  // alphabets: []
};
