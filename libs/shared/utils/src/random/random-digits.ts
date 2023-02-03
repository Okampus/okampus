export function randomDigits(length: number): string {
  return Math.random()
    .toString()
    .slice(2, 2 + length);
}
