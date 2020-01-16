import { inPixels, defaultPageDims } from "./PageDims";

test("A4 at 300 DPI", () => {
  expect(inPixels(defaultPageDims())).toEqual([2490, 3510]);
});

test("A4 at 200 DPI", () => {
  expect(inPixels(defaultPageDims({ dpi: 200 }))).toEqual([1660, 2340]);
});

test("A4 Landscape at 300 DPI", () => {
  expect(inPixels(defaultPageDims({ landscape: true }))).toEqual([3510, 2490]);
});

test("Custom Pixels", () => {
  expect(
    inPixels(
      defaultPageDims({
        customUnits: "px",
        customSize: [1024, 768],
        paperSize: "Custom"
      })
    )
  ).toEqual([1024, 768]);
});

test("Custom Inches", () => {
  expect(
    inPixels(
      defaultPageDims({
        customUnits: "in",
        customSize: [8, 10],
        paperSize: "Custom"
      })
    )
  ).toEqual([2400, 3000]);
});

test("Custom cm", () => {
  expect(
    inPixels(
      defaultPageDims({
        customUnits: "cm",
        customSize: [8, 10],
        paperSize: "Custom"
      })
    )
  ).toEqual([945, 1181]);
});
