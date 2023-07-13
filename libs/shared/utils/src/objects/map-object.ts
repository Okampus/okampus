export function mapObject<T extends Record<string, unknown>, U>(
  obj: T,
  mapFn: <K extends keyof T>(key: K, value: T[K]) => U
) {
  const result: { [K in keyof T]: U } = {} as { [K in keyof T]: U };
  for (const name of Object.keys(obj) as Array<keyof T>) result[name] = mapFn(name, obj[name]);
  return result;
}
