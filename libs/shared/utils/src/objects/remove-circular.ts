import { isObject } from './is-object';

type IdentifyFunc = (obj1: object, obj2: object) => boolean;
const equals = (obj1: object, obj2: object) => obj1 === obj2;

export function referenceRemover<T extends object>(src: T, identify: IdentifyFunc = equals): T {
  const weakReferenceValue = new WeakRef({ value: undefined });

  function internalReferenceCheck<T extends object>(
    references: object[],
    target: T,
    value: unknown,
    key?: string
  ): void {
    const applyToTarget = Array.isArray(target)
      ? <T>(value: T) => {
          target.push(value);
          return value;
        }
      : typeof target === 'object' && key !== undefined
      ? <T>(value: T) => {
          // @ts-expect-error - object supports key
          target[key] = value;
          return value;
        }
      : () => {
          return;
        };

    if (isObject(value)) {
      let referenceFound = false;

      for (const reference of references) {
        if (identify(value, reference)) {
          applyToTarget(weakReferenceValue.deref()?.value);
          referenceFound = true;
          break;
        }
      }

      if (!referenceFound) {
        let ref;
        if (!value || value instanceof Date) {
          applyToTarget(value);
          return;
        } else if (Array.isArray(value) || value instanceof Set || value instanceof Map) {
          ref = applyToTarget<object>([...value]);
        } else {
          ref = applyToTarget({ ...value });
        }
        if (ref) internalRemover(ref, value, [...references, value]);
      }
    } else {
      applyToTarget(value);
    }
  }

  function internalRemover<T extends object>(target: T, src: T, references: object[]): T {
    if (Array.isArray(src)) for (const value of src) internalReferenceCheck(references, target, value);
    else for (const [key, value] of Object.entries(src)) internalReferenceCheck(references, target, value, key);
    return target;
  }

  // @ts-expect-error - initial call
  return internalRemover({}, src, [src]);
}
