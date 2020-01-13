export function capitalize(str: string) {
  const [first, ...rest] = Array.from(str);
  return `${first.toLocaleUpperCase()}${rest}`;
}

export function stripExt(str: string) {
  return str.replace(/\..*$/, "");
}
