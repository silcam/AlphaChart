import { last } from "./ArrayUtils";

// test("ById", () => {
//   const list = [{ id: "a" }, { id: "b" }];
//   expect(byId(list, "id")).toEqual({ a: { id: "a" }, b: { id: "b" } });
// });

test("last", () => {
  expect(last([1, 2, 3])).toBe(3);
  expect(last([])).toBeUndefined();
});
