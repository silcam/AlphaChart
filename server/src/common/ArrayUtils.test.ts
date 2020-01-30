import { last, randomSelection } from "./ArrayUtils";

// test("ById", () => {
//   const list = [{ id: "a" }, { id: "b" }];
//   expect(byId(list, "id")).toEqual({ a: { id: "a" }, b: { id: "b" } });
// });

test("last", () => {
  expect(last([1, 2, 3])).toBe(3);
  expect(last([])).toBeUndefined();
});

test("randomSelection", () => {
  const list = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const randomLetters = randomSelection(list, 3);

  expect(randomLetters.length).toBe(3);

  // Unique values
  expect(randomLetters[0]).not.toBe(randomLetters[1]);
  expect(randomLetters[0]).not.toBe(randomLetters[2]);
  expect(randomLetters[1]).not.toBe(randomLetters[2]);

  // Maintain order
  expect(randomLetters[1] > randomLetters[0]).toBe(true);
  expect(randomLetters[2] > randomLetters[1]).toBe(true);
});

test("randomSelection short arrays", () => {
  expect(randomSelection([], 4)).toEqual([]);
  expect(randomSelection([1, 2, 3], 99)).toEqual([1, 2, 3]);
});
