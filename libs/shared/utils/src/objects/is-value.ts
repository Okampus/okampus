export function isValue<T extends Record<string, unknown>>(value: unknown, obj: T): value is T[keyof T] {
  return Object.values(obj).includes(value);
}
