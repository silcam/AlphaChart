import { stripExt } from "./stringUtils";

test("stripExt", () => {
  expect(stripExt("1234.jpg")).toBe("1234");
  expect(stripExt("1234")).toBe("1234");
  expect(stripExt("1234.jpg.png")).toBe("1234");
});
