export function exclude<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj as Record<K, unknown>).filter(([key, _]) => !keys.includes(key as K))
  ) as Omit<T, K>;
}
