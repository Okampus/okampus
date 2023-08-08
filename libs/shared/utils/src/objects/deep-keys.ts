import type { NestedKeyOf } from '@okampus/shared/types';

export function getDeepKeys<T extends Record<string, unknown>>(obj: T, prefix = ''): NestedKeyOf<T>[] {
  // @ts-ignore - TS doesn't like the recursive type
  // eslint-disable-next-line unicorn/no-array-reduce
  return Object.keys(obj).reduce((res, el) => {
    // @ts-ignore - TS doesn't like the recursive type
    if (Array.isArray(obj[el])) return res;
    // @ts-ignore - TS doesn't like the recursive type
    else if (typeof obj[el] === 'object' && obj[el] !== null) return [...res, ...keyify(obj[el], prefix + el + '.')];
    return [...res, prefix + el];
  }, []);
}
