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
