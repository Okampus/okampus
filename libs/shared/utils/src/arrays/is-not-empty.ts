// TS-friendly not empty array check
export function isNotEmpty<T extends Array<unknown>>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined && value.length > 0;
}
