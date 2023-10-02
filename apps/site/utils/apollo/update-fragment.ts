import { apolloClient } from '../../app/_context/apollo';

import type { CacheIdWhere } from '../../app/_context/apollo';
import type { DocumentNode } from 'graphql';

export type UpdateFragmentOptions<T> = {
  __typename: string;
  fragment: DocumentNode;
  where: CacheIdWhere;
  update: (data: T) => T;
};

export function updateFragment<T>({ __typename, fragment, where, update }: UpdateFragmentOptions<T>) {
  const id = apolloClient.cache.identify({ __typename, ...where });

  apolloClient.cache.updateFragment<T>({ fragment, id }, (data) => {
    if (!data) return null;
    return update(data);
  });
}
