type RangeArgs = { from?: number; to: number; step?: number };
export function range({ from = 0, to, step = 1 }: RangeArgs): number[] {
  return Array.from({ length: (to - from) / step }, (_, i) => from + i * step);
}
