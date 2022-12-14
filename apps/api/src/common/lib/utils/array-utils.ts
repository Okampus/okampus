export function randomFromArrayWithRemainder<T>(arr: T[], min: number, max = 0): [output: T[], remainder: T[]] {
  arr = [...arr];
  const len = arr.length;
  const size = Math.floor(Math.random() * (max - min + 1)) + min;
  const res: T[] = [];

  for (let i = 0; i < size; i++) {
    const j = Math.floor(Math.random() * (len - i));
    res.push(arr[j]);
    arr[j] = arr[len - i - 1];
  }

  return [res, arr];
}

export function randomFromArray<T>(arr: T[], min: number, max = 0): T[] {
  return randomFromArrayWithRemainder<T>(arr, min, max)[0];
}

export function shuffleArray<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}
