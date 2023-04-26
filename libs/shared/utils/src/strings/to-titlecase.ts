import { capitalize } from './capitalize';

export function toTitleCase(str: string): string {
  return str.replace(/\b\w/g, capitalize);
}
