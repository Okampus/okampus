export function isNotNull<T>(argument: T | undefined | null): argument is NonNullable<T> {
  return argument !== undefined && argument !== null;
}
