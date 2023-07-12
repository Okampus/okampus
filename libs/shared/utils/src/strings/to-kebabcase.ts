export function toKebabCase(str: string): string {
  return str.replaceAll(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());
}
