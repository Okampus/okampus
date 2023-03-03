import type { NoUndefined } from '@okampus/shared/types';

export function keepDefined<T extends Record<string, unknown>>(obj: T): NoUndefined<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined)) as T;
}
