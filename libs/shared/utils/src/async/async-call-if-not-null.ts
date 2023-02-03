export async function asyncCallIfNotNull<T, R>(
  value: T | null | undefined,
  callback: (value: T) => Promise<R>
): Promise<R | null> {
  return value ? callback(value) : Promise.resolve(null);
}
