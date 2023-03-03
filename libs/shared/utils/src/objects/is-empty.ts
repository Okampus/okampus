export function isEmpty(obj: Record<string, unknown>): boolean {
  for (const _ in obj) return false;
  return true;
}
