import { arrayOf, arrayResize, modelListMerge, flat } from "./arrayUtils";

test("arrayOf", () => {
  expect(arrayOf(0, 4)).toEqual([0, 0, 0, 0]);
});

test("arrayResize", () => {
  expect(arrayResize([1, 2, 3], 2, () => 0)).toEqual([1, 2]);
  expect(arrayResize([1, 2, 3], 4, () => 0)).toEqual([1, 2, 3, 0]);
});

test("modelListMerge", () => {
  const a = [{ id: "0" }, { id: "1", name: "Wilma" }, { id: "2" }];
  const b = [{ id: "1", name: "Fred" }, { id: "3" }];
  const out = [
    { id: "0" },
    { id: "1", name: "Fred" },
    { id: "2" },
    { id: "3" }
  ];
  expect(modelListMerge(a, b)).toEqual(out);
});

test("flat", () => {
  expect(
    flat([
      [0, 1],
      [2, 3]
    ])
  ).toEqual([0, 1, 2, 3]);
});
