export function isKey<T extends Record<string, unknown>>(key: string | number | symbol, obj: T): key is keyof T {
  return key in obj;
}
