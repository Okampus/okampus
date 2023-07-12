export function findLast<T>(arr: T[], predicate: (item: T) => boolean) {
  for (let i = arr.length - 1; i >= 0; i--) if (predicate(arr[i])) return arr[i];
  return;
}
