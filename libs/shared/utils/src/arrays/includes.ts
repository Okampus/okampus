export function includes<TValue>(value: unknown, allowedValues: ReadonlyArray<TValue>): value is TValue {
  return (allowedValues as ReadonlyArray<unknown>).includes(value);
}
