import { capitalize } from './capitalize';

export function toTitleCase(str: string): string {
  return str.replaceAll(/\b\w/g, capitalize);
}
