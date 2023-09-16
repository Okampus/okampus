import { shuffleArray } from './shuffle';

export function pickWithRemainder<T>(arr: T[], min: number, max = 0): [output: T[], remainder: T[]] {
  arr = shuffleArray([...arr]);
  const size = max ? Math.floor(Math.random() * (max - min + 1)) + min : min;

  return [arr.slice(0, size), arr.slice(size)];
}

export function pickOneRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickRandom<T>(arr: T[], min: number, max = 0): T[] {
  return pickWithRemainder<T>(arr, min, max)[0];
}
