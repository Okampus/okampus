export const iso8601Regex = /^\d{4}-(?:0\d|1[0-2])-(?:[0-2]\d|3[01])$/iu;

export function isISO8601(value: string): boolean {
  return iso8601Regex.test(value);
}
