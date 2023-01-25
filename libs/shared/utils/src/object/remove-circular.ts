export function referenceRemover<T extends object>(
  src: T,
  identify: (obj1: object, obj2: object) => boolean = (obj1, obj2) => obj1 === obj2
): T {
  const weakReferenceValue = new WeakRef({ value: undefined });

  function internalRemover(target: object, src: object, references: object[]) {
    for (const key in src) {
      const srcValue = src[key as keyof typeof src] as object;

      if ('object' === typeof srcValue) {
        let referenceFound = false;

        for (const reference of references) {
          if (identify(srcValue, reference)) {
            target[key as keyof typeof target] = weakReferenceValue.deref()?.value as never;
            referenceFound = true;
            break;
          }
        }

        if (!referenceFound) {
          if (!srcValue) {
            target[key as keyof typeof target] = srcValue;
            continue;
          } else if (Array.isArray(srcValue)) {
            target[key as keyof typeof target] = [...srcValue] as never;
            internalRemover(target[key as keyof typeof target], srcValue, [...references, srcValue]);
          } else if (srcValue instanceof Map) {
            const entries = [...srcValue];
            target[key as keyof typeof target] = entries as never;
            internalRemover(entries, entries, [...references, entries]);
          } else if (srcValue instanceof Date) {
            target[key as keyof typeof target] = srcValue as never;
            continue;
          } else {
            target[key as keyof typeof target] = { ...srcValue } as never;
            internalRemover(target[key as keyof typeof target], srcValue, [...references, srcValue]);
          }
        }
      } else {
        target[key as keyof typeof target] = srcValue;
        continue;
      }
    }
    return target;
  }
  return internalRemover({}, src, [src]) as T;
}
