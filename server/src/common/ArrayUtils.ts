// export function byId<T>(list: T[], idField: keyof T): { [key: string]: T } {
//   const empty: { [key: string]: T } = {};
//   return list.reduce((byId, item) => {
//     byId[`${item[idField]}`] = item;
//     return byId;
//   }, empty);
// }

export function last<T>(list: T[]): T | undefined {
  return list[list.length - 1];
}

export function randomSelection<T>(list: T[], number: number): T[] {
  if (number >= list.length) return list;

  const ids: number[] = [];
  while (ids.length < number) {
    const randomId = Math.floor(Math.random() * list.length);
    if (!ids.includes(randomId)) ids.push(randomId);
  }
  return list.filter((_, index) => ids.includes(index));
}
