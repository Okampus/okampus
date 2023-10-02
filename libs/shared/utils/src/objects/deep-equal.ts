import { isNonNullObject } from './is-object';

export function deepEqual(obj1: unknown, obj2: unknown, noOrder = false): boolean {
  if (obj1 === obj2) return true;

  if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2) return false;

  if (isNonNullObject(obj1) && isNonNullObject(obj2)) {
    // Date
    if (obj1 instanceof Date && obj2 instanceof Date) return obj1.getTime() === obj2.getTime();

    // Arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      if (noOrder) {
        obj1.sort();
        obj2.sort();
      }

      for (const [i, element] of obj1.entries()) if (!deepEqual(element, obj2[i])) return false;
      return true;
    }

    // Objects
    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

    // Compare objects with same number of keys
    for (const key in obj1) {
      if (!(key in obj2)) return false; //other object doesn't have this prop
      if (!deepEqual(obj1[key], obj2[key])) return false;
    }
  } else {
    // Primitive
    return obj1 === obj2;
  }

  return true;
}
