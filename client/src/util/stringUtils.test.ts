import { stripExt, capitalize } from "./stringUtils";
import { test, expect } from 'vitest';

test("stripExt", () => {
  expect(stripExt("1234.jpg")).toBe("1234");
  expect(stripExt("1234")).toBe("1234");
  expect(stripExt("1234.jpg.png")).toBe("1234");
});

test("Capitalize", () => {
  expect(capitalize("b")).toBe("B")
  expect(capitalize("þ")).toBe("Þ")
  expect(capitalize("%")).toBe("%") // sometimes there is no capital
  expect(capitalize("🍕")).toBe("🍕") // sometimes there is no capital
})