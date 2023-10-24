import { apolloClient } from '../../app/_context/apollo';
import type { DocumentNode } from 'graphql';
import type { CacheIdWhere } from '../../app/_context/apollo';

export type WriteFragmentOptions<T> = {
  __typename: string;
  fragment: DocumentNode;
  where?: CacheIdWhere;
  data: T;
};
export function writeFragment<T>({ __typename, data, fragment, where }: WriteFragmentOptions<T>) {
  const id = apolloClient.cache.identify({ __typename, ...(where ?? data) });
  apolloClient.cache.writeFragment({ id, data, fragment });
}
