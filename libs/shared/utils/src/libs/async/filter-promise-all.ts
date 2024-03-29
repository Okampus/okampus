import { isNotNull } from '../../objects/is-not-null';

export function filterPromiseAll<T>(promises: Promise<T>[], filter: (value: T) => boolean): Promise<T[]> {
  return Promise.all(promises).then((values) => values.filter(filter));
}

export function filterNullPromiseAll<T>(promises: Promise<T | null | undefined>[]): Promise<T[]> {
  return Promise.all(promises).then((values) => values.filter(isNotNull));
}
