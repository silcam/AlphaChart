import crypto from "crypto";

export function createPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(password, salt);
  return {
    hash,
    salt
  };
}

export function checkPassword(password: string, hash: string, salt: string) {
  const checkHash = hashPassword(password, salt);
  return checkHash === hash;
}

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}
