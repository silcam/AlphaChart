import { createPassword, checkPassword } from "./password";

test("password", () => {
  const password = "password";
  const { hash, salt } = createPassword(password);
  expect(salt.length).toBe(32);
  expect(hash.length).toBeGreaterThan(32);

  const { hash: newHash, salt: newSalt } = createPassword(password);
  expect(newHash).not.toEqual(hash);
  expect(newSalt).not.toEqual(salt);

  expect(checkPassword(password, hash, salt)).toBe(true);
  expect(checkPassword("notit", hash, salt)).toBe(false);
  expect(checkPassword(password, "nope", salt)).toBe(false);
  expect(checkPassword(password, hash, "uh-uh")).toBe(false);
});
