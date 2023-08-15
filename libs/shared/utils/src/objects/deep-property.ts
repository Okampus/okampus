import { isNonNullObject } from './is-object';
import type { DeepProperty, NestedKeyOf } from '@okampus/shared/types';

export function getDeepProperty<T extends Record<string, unknown>, P extends NestedKeyOf<T>>(
  obj: T,
  path: P
  // @ts-ignore - TS doesn't like the recursive type
): DeepProperty<T, P> {
  const keys = path.split('.') as Array<keyof T>;
  let result = obj;
  for (const key of keys) {
    // @ts-ignore - TS doesn't like the recursive type
    if (isNonNullObject(result)) result = result[key];
    else throw new Error(`Cannot get property ${path} from ${obj}`);
  }

  // @ts-ignore - TS doesn't like the recursive type
  return result as DeepProperty<T, P>;
}
