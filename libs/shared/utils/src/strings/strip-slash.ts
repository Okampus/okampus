export function stripSlash(value: string): string {
  return value.replace(/\/$/, '').replace(/^\//, '');
}
