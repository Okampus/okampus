export function isIn<T extends object>(key: unknown, obj: T): key is keyof T {
  return (key as string) in obj;
}
