export type Dims = [number, number];

export const PaperSizes = <const>[
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "8.5x11",
  "Custom"
];
export type PaperSize = typeof PaperSizes[number];
export const UnitsOfLength = <const>["cm", "in", "px"];
export type UnitOfLength = typeof UnitsOfLength[number];

export interface PageDims {
  paperSize: PaperSize;
  landscape: boolean;
  customSize: Dims;
  customUnits: UnitOfLength;
  dpi: number;
  margin: number;
}

// Numbers in inches
const paperSizes = {
  A0: [33.1, 46.8],
  A1: [23.4, 33.1],
  A2: [16.5, 23.4],
  A3: [11.7, 16.5],
  A4: [8.3, 11.7],
  A5: [5.8, 8.3],
  "8.5x11": [8.5, 11]
};

export function usingPx(pageDims: PageDims) {
  return pageDims.paperSize === "Custom" && pageDims.customUnits === "px";
}

function convertDPI(pageDims: PageDims) {
  switch (pageDims.customUnits) {
    case "px":
      return 1;
    case "in":
      return pageDims.dpi;
    case "cm":
    default:
      return pageDims.dpi / 2.54;
  }
}

export function pageInPixels(pageDims: PageDims): Dims {
  if (pageDims.paperSize === "Custom") {
    const dotsPerUnit = convertDPI(pageDims);
    return dimsMap(pageDims.customSize, val => Math.round(val * dotsPerUnit));
  }
  const pixDims = dimsMap(paperSizes[pageDims.paperSize] as Dims, val =>
    Math.round(val * pageDims.dpi)
  );
  return pageDims.landscape ? dimsRev(pixDims) : pixDims;
}

export function contentInPixels(pageDims: PageDims): Dims {
  const pageDimsPx = pageInPixels(pageDims);
  if (usingPx(pageDims)) return pageDimsPx;

  const marginPx = pageDims.margin * pageDims.dpi;
  return dimsMap(pageDimsPx, px => Math.max(px - 2 * marginPx, 1));
}

export function defaultPageDims(merge?: Partial<PageDims>): PageDims {
  const defaultDims: PageDims = {
    paperSize: "A4",
    landscape: false,
    dpi: 300,
    customSize: [8.5, 11],
    customUnits: "in",
    margin: 0.5
  };
  return merge ? { ...defaultDims, ...merge } : defaultDims;
}

export function dpiOptions() {
  return [100, 150, 200, 250, 300];
}

export function dimsMap<T>(
  dims: Dims,
  map: (val: number, index: number) => T
): [T, T] {
  return dims.map(map) as [T, T];
}

export function dimsRev(dims: Dims): Dims {
  return [dims[1], dims[0]];
}
