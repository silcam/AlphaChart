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

export function inPixels(pageDims: PageDims): Dims {
  if (pageDims.paperSize === "Custom") {
    const dotsPerUnit = convertDPI(pageDims);
    return pageDims.customSize.map(val =>
      Math.round(val * dotsPerUnit)
    ) as Dims;
  }
  const pixDims = paperSizes[pageDims.paperSize].map(val =>
    Math.round(val * pageDims.dpi)
  );
  return (pageDims.landscape ? pixDims.reverse() : pixDims) as Dims;
}

export function defaultPageDims(merge?: Partial<PageDims>): PageDims {
  const defaultDims: PageDims = {
    paperSize: "A4",
    landscape: false,
    dpi: 300,
    customSize: [21, 29.7],
    customUnits: "cm"
  };
  return merge ? { ...defaultDims, ...merge } : defaultDims;
}

export function dpiOptions() {
  return [100, 150, 200, 250, 300];
}
