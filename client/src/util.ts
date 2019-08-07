export function arrayOf<T>(what: T, size: number) {
  return new Array(size).fill(what);
}

export function arrayResize<T>(
  original: T[],
  size: number,
  fillWith: () => T
): T[] {
  return arrayOf(null, size).map((_, index) =>
    index < original.length ? original[index] : fillWith()
  );
}
