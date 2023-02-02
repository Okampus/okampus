// Checks whether an object obj1 contains an object obj2 as a deep subset

import { isObject } from './is-object';

export function objectContains(obj1: unknown, obj2: unknown): boolean {
  if (!isObject(obj1) || !isObject(obj2)) {
    return false;
  }

  return Object.keys(obj2 as Record<string, unknown>).every((key) => {
    return isObject((obj2 as Record<string, unknown>)[key])
      ? objectContains((obj1 as Record<string, unknown>)[key], (obj2 as Record<string, unknown>)[key])
      : (obj1 as Record<string, unknown>)[key] === (obj2 as Record<string, unknown>)[key];
  });
}
