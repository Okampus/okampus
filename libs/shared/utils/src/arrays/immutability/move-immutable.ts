export function moveImmutable<T>(arr: readonly T[], from: number, to: number): T[] {
  const clone = [...arr];
  const value = clone[from];
  clone.splice(from, 1);
  clone.splice(to, 0, value);
  return clone;
}
