export function range(from: number, to: number, step = 1): number[] {
  return Array.from({ length: (to - from) / step + 1 }, (_, i) => from + i * step);
}
