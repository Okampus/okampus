export function mergeUnique<T>(array1: T[], array2: T[]): T[] {
  return [...array1, ...array2.filter((item) => !array1.includes(item))];
}
