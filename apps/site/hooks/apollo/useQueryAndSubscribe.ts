import { getSubscriptionFromQuery } from '../../utils/apollo/get-from-query';
import { useEffect } from 'react';
import { useQuery } from '@apollo/client';

import type { ApolloError, DocumentNode, OperationVariables, QueryHookOptions } from '@apollo/client';

export type UseQueryAndSubscribeOptions<T, U extends OperationVariables> = {
  query: DocumentNode;
  variables?: U;
  options?: QueryHookOptions<T, U>;
};
export function useQueryAndSubscribe<T, U extends OperationVariables>({
  query,
  variables,
  options,
}: UseQueryAndSubscribeOptions<T, U>): {
  data?: T;
  error?: ApolloError;
  loading: boolean;
} {
  const { data, loading, error, subscribeToMore } = useQuery<T, U>(query, { ...options, variables });

  useEffect(() => {
    subscribeToMore({
      document: getSubscriptionFromQuery(query),
      updateQuery: (previous, { subscriptionData }) =>
        subscriptionData.data ? { ...previous, ...subscriptionData.data } : previous,
    });
  }, [subscribeToMore, query]);

  return { data, loading, error };
}
