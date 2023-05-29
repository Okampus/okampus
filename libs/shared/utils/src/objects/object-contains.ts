import { isNonNullObject } from './is-object';

/* Checks whether an object contains "contained" as a deep subset */
export function objectContains<T extends Record<string, unknown>>(object: unknown, contained: T): object is T {
  if (!isNonNullObject(object) || !isNonNullObject(contained)) {
    return false;
  }

  return Object.keys(contained).every((key) => {
    const subObject = contained[key];
    return isNonNullObject(subObject) ? objectContains(object[key], subObject) : object[key] === subObject;
  });
}
