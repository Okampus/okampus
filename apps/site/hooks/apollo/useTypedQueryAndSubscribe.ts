import { typedGql, useTypedQuery } from '@okampus/shared/graphql';
import { useEffect, useMemo } from 'react';
import type { GraphQLTypes, InputType, ValueTypes } from '@okampus/shared/graphql';
import type { ApolloError } from '@apollo/client';

type QueryName = keyof ValueTypes['Query'] & keyof GraphQLTypes['Query'];
export function useTypedQueryAndSubscribe<O extends QueryName, T extends ValueTypes['Query'][O]>({
  queryName,
  selector,
}: {
  queryName: O;
  selector: T;
}): {
  data?: InputType<GraphQLTypes['Query'], { [key in O]: T }>;
  error?: ApolloError;
  loading: boolean;
} {
  const query = useMemo(() => ({ [queryName]: selector }), [queryName, selector]);
  const { data, loading, error, subscribeToMore } = useTypedQuery(query);

  useEffect(() => {
    subscribeToMore({
      // @ts-ignore
      document: typedGql('subscription')(query),
      // @ts-ignore
      updateQuery: (previous, { subscriptionData }) =>
        // @ts-ignore
        subscriptionData.data ? { ...previous, [queryName]: subscriptionData.data[queryName] } : previous,
    });
  }, [subscribeToMore, selector, query, queryName]);

  // @ts-ignore
  return { data: data as InputType<GraphQLTypes['Query'], { [key in O]: T }> | undefined, loading, error };
}
