import slugify from 'slugify';

export function _slugify(value: string): string {
  return slugify(value, { lower: true, strict: true });
}
