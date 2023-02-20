export function exclude<T extends Record<K, unknown>, K extends keyof T>(obj: T, ...keys: string[]): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([key, _]) => !keys.includes(key))) as Omit<T, K>;
}
