export function getMinMax<T extends number>(...arr: T[]): { min: number; max: number } {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return { min, max };
}
