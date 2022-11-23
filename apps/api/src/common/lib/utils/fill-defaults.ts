type Couple<A, B> = [record: A, defaultValue: B];

export function fillDefaults<T extends number | string | symbol>(
  keys: T[],
  recordsDefaults: Array<Couple<Record<T, unknown>, unknown>>,
): void {
  for (const key of keys) {
    for (const [record, defaultValue] of recordsDefaults) {
      if (!record[key])
        record[key] = defaultValue;
    }
  }
}
