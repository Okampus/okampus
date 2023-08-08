export function fromEntries<K extends string | symbol | number, T>(entries: [K, T][]): Record<K, T> {
  return Object.fromEntries(entries) as Record<K, T>;
}
