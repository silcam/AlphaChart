import { Group, isGroup } from "./Group";
import { User } from "./User";

test("isGroup true for valid group", () => {
  const group: Group = { id: "Id", name: "Group", users: ["userId"] };
  expect(isGroup(group)).toBe(true);
});

// The original purpose of the method is to distinguish groups and users
test("isGroup false for user", () => {
  const user: User = { id: "Id", name: "User" };
  expect(isGroup(user)).toBe(false);
});
