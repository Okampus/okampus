export function isStringArray(arr: unknown): arr is string[] {
  if (!Array.isArray(arr)) return false;
  for (const element of arr) if (typeof element !== 'string') return false;
  return true;
}
