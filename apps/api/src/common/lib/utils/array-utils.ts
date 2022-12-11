export function sampleArray<T>(arr: T[], min: number, max?: number): T[] {
  arr = [...arr];
  const len = arr.length;
  const size = max ? Math.floor(Math.random() * (max - min + 1)) + min : min;
  const res = [];
  for (let i = 0; i < size; i++) {
      const j = Math.floor(Math.random() * (len - i));
      res.push(arr[j]);
      arr[j] = arr[len - i - 1];
  }
  return res;
}

export function sampleArrayWithRest<T>(arr: T[], min: number, max?: number): [res: T[], rest: T[]] {
  arr = [...arr];
  const len = arr.length;
  const size = max ? Math.floor(Math.random() * (max - min + 1)) + min : min;
  const res = [];
  for (let i = 0; i < size; i++) {
      const j = Math.floor(Math.random() * (len - i));
      res.push(arr[j]);
      arr[j] = arr[len - i - 1];
  }
  return [res, arr];
}

export function shuffleArray<T>(arr: T[]): T[] {
  let j;
  let x;
  let i;
  for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = arr[i];
      arr[i] = arr[j];
      arr[j] = x;
  }
  return arr;
}
