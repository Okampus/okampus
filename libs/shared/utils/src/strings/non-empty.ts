export function isNonEmptyString(str: string) {
  return typeof str === 'string' && !!str.trim();
}
