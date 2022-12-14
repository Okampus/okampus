import slug from 'slugify';

export function slugify(value: string): string {
  return slug(value, { lower: true, strict: true });
}
