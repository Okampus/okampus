import { isNonNullObject } from './is-object';

export function nestedObjKeysToArr(obj: Record<string, unknown>, path: string[] = [], join = '.'): string[] {
  const arr = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newPath = [...path, key];
    if (isNonNullObject(value)) {
      arr.push(...nestedObjKeysToArr(value, newPath));
    } else {
      arr.push(newPath.join(join));
    }
  }

  return arr;
}
