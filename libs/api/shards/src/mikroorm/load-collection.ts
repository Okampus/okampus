import { isNotNull } from '@okampus/shared/utils';
import type { Collection } from '@mikro-orm/core';

export function isLoaded<T extends object>(collection: Collection<T>) {
  return collection && collection.isInitialized();
}

export function load<T extends object>(collection: Collection<T>): T[] {
  return isLoaded(collection) ? collection.getItems() : [];
}

export function loadApply<T extends object, U>(collection: Collection<T>, apply: (item: T) => U): NonNullable<U>[] {
  return load(collection)
    .map((elem) => apply(elem))
    .filter(isNotNull);
}

export async function loadApplyAsync<T extends object, U>(
  collection: Collection<T>,
  apply: (item: T) => Promise<U>
): Promise<NonNullable<U>[]> {
  return Promise.all(load(collection).map((elem) => apply(elem))).then((elems) => elems.filter(isNotNull));
}
