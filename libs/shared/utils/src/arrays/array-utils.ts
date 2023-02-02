export function shuffleArray<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

export function randomFromArrayWithRemainder<T>(
  arr: T[],
  min: number,
  max = 0
): [output: T[], remainder: T[]] {
  arr = shuffleArray([...arr]);
  const size = max ? Math.floor(Math.random() * (max - min + 1)) + min : min;

  return [arr.slice(0, size), arr.slice(size)];
}

export function pickOneFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomFromArray<T>(arr: T[], min: number, max = 0): T[] {
  return randomFromArrayWithRemainder<T>(arr, min, max)[0];
}
