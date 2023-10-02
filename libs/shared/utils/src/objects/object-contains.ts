import { deepEqual } from './deep-equal';
import { isNonNullObject } from './is-object';

/* Checks whether an object contains "contained" as a deep subset */
export function objectContains<T extends Record<string, unknown>, U>(object: U, contained: T): object is T & U {
  if (!isNonNullObject(object) || !isNonNullObject(contained)) {
    return false;
  }

  return Object.keys(contained).every((key) => {
    const subObject = contained[key];
    return isNonNullObject(subObject) ? objectContains(object[key], subObject) : deepEqual(object[key], subObject);
  });
}
