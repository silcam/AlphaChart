import update from "immutability-helper";

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

export function modelListMerge<T extends { id: string }>(
  aList: readonly T[],
  bList?: readonly T[],
  sort?: (a: T, b: T) => number
): T[] {
  if (!bList || bList.length == 0) return aList as T[];

  const mergedList = bList.reduce((list, item) => {
    const index = list.findIndex(existing => existing.id == item.id);
    return index < 0
      ? [...list, item]
      : update(list, { [index]: { $set: item } });
  }, aList) as T[];

  if (sort) mergedList.sort(sort);

  return mergedList;
}

export function flat<T>(list: T[][]): T[] {
  return list.reduce((flatList: T[], item) => flatList.concat(item), []);
}
