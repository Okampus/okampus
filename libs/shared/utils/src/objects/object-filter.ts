export function objectFilter<T extends object>(obj: T, predicate: <K extends keyof T>(key: K, value: T[K]) => boolean) {
  const result: { [K in keyof T]?: T[K] } = {};
  for (const name of Object.keys(obj) as Array<keyof T>) {
    if (predicate(name, obj[name])) {
      result[name] = obj[name];
    }
  }
  return result;
}
