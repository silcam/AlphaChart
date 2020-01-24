import { inTolerance, numberFilter } from "./numberUtils";

test("In Tolerance", () => {
  expect(inTolerance(100, 95, 0.1)).toBe(true);
  expect(inTolerance(100, 85, 0.1)).toBe(false);
});

test("Number Filter", () => {
  expect(numberFilter(4)).toBe(4);
  expect(numberFilter(5 / 0)).toBe(0);
  expect(numberFilter(0 / 0)).toBe(0);
  expect(numberFilter(-2, { min: 0 })).toBe(0);
  expect(numberFilter(4, { min: 0 })).toBe(4);
  expect(numberFilter(0 / 0, { min: 0.001 })).toBe(0.001);
  expect(numberFilter(5 / 0, { min: 0.001 })).toBe(0.001);
  expect(numberFilter("4")).toBe(4);
  expect(numberFilter("0.000001", { min: 0.1 })).toBe(0.1);
  expect(numberFilter("abc", { min: 0.1 })).toBe(0.1);
});
