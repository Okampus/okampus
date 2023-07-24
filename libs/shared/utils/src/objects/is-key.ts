export function isKey<K extends string | number | symbol, T extends Record<K, unknown>>(
  key: string | number | symbol,
  obj: T
): key is keyof T {
  return key in obj;
}
