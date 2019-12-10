import { arrayOf, arrayResize } from "./arrayUtils";

test("arrayOf", () => {
  expect(arrayOf(0, 4)).toEqual([0, 0, 0, 0]);
});

test("arrayResize", () => {
  expect(arrayResize([1, 2, 3], 2, () => 0)).toEqual([1, 2]);
  expect(arrayResize([1, 2, 3], 4, () => 0)).toEqual([1, 2, 3, 0]);
});
