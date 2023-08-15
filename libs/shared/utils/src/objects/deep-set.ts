import { isNonNullObject } from './is-object';
import type { DeepProperty, NestedKeyOf } from '@okampus/shared/types';

export function setDeepProperty<T extends Record<string, unknown>, P extends NestedKeyOf<T>>(
  obj: T,
  path: P,
  // @ts-ignore - TS doesn't like the recursive type
  value: DeepProperty<T, P>,
  ensure?: boolean
): void {
  const keys = path.split('.') as Array<keyof T>;
  let result = obj;
  const last = keys.pop() as keyof T;

  let previous = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (isNonNullObject(result)) {
      previous = result;
      // @ts-ignore - TS doesn't like the recursive type
      result = result[key];
    } else if (ensure) throw new Error(`Cannot set property ${path} in ${JSON.stringify(obj)}`);
    else {
      const remaining = keys.slice(i);
      for (const key of remaining) {
        // @ts-ignore - TS doesn't like the recursive type
        previous[key] = {};
        // @ts-ignore - TS doesn't like the recursive type
        previous = previous[key];
      }
      // @ts-ignore - TS doesn't like the recursive type
      previous[last] = value;
      return;
    }
  }

  // @ts-ignore - TS doesn't like the recursive type
  result[last] = value;
}
