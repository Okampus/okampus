export function nonEmptyOrNull<T extends Array<unknown>>(value: T | null | undefined): T | null {
  return value ? (value.length > 0 ? value : null) : null;
}
