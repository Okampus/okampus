import slug from 'slugify';

export function toSlug(value: string): string {
  return slug(value, { lower: true, strict: true });
}
