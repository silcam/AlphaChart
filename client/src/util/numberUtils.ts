export function inTolerance(exp: number, act: number, tolerance: number) {
  return Math.abs(act - exp) / exp <= tolerance;
}

export function numberFilter(x: any, opts: { min?: number } = {}) {
  if (typeof x !== "number") x = parseFloat(x);

  if (isNaN(x)) x = 0;

  if (x === Infinity) x = 0;

  if (opts.min !== undefined && x < opts.min) return opts.min;

  return x;
}
