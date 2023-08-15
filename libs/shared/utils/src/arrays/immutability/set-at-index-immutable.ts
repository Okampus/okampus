export function setAtIndexImmutable<T>(arr: Array<T> | ReadonlyArray<T>, idx: number, value: T): T[] {
  return arr.map((previous, index) => (index === idx ? value : previous));
}
