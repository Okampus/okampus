export function countChar(value: string, char: string): number {
  let count = 0;
  for (const key of value) if (key === char) count++;
  return count;
}
