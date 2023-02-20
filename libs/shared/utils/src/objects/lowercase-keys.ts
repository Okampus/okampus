// Lowercases the keys of an object

export function lowercaseKeys<V>(obj: Record<string, V>): Record<string, V> {
  const result: Record<string, V> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key.toLowerCase()] = value;
  }
  return result;
}
