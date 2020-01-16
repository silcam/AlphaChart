export function inTolerance(exp: number, act: number, tolerance: number) {
  return Math.abs(act - exp) / exp <= tolerance;
}
