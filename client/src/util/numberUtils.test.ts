import { inTolerance } from "./numberUtils";

test("In Tolerance", () => {
  expect(inTolerance(100, 95, 0.1)).toBe(true);
  expect(inTolerance(100, 85, 0.1)).toBe(false);
});
