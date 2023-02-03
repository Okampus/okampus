import { Collection } from '@mikro-orm/core';

export function isLoaded<T extends object>(collection: Collection<T>) {
  return collection && collection.isInitialized();
}

export function load<T extends object>(collection: Collection<T>): T[] {
  return isLoaded(collection) ? collection.getItems() : [];
}

export function loadApply<T extends object, U>(collection: Collection<T>, apply: (item: T) => U): NonNullable<U>[] {
  return load(collection)
    .map((elem) => apply(elem))
    .filter((elem) => !!elem) as NonNullable<U>[];
}
