import { isIn, isNonNullObject } from '@okampus/shared/utils';
import type { ApolloError } from '@apollo/client';
import type { GraphQLError } from 'graphql';

function getMessageFromGraphqlError(error: GraphQLError) {
  const exception = error.extensions?.exception;
  if (isNonNullObject(exception) && isIn('message', exception)) return error.message;
  return error.message;
}

export function getGraphQLErrors(apolloError: ApolloError) {
  const errors = [
    ...(apolloError.networkError ? [{ message: apolloError.networkError.message }] : []),
    ...(apolloError.graphQLErrors.map((error) => ({ message: getMessageFromGraphqlError(error) })) ?? []),
    ...(apolloError.clientErrors.map((error) => ({ message: error.message })) ?? []),
  ];

  return errors;
}
