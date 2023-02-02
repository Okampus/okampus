export function toggleInArray(arr: unknown[], idx: number): unknown[] {
  arr.fill(false);
  if (idx < 0 || idx >= arr.length) return arr;

  arr[idx] = true;
  return arr;
}
