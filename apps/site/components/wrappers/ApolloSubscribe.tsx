'use client';

import { useSubscription } from '@apollo/client';
import type { DocumentNode, OperationVariables } from '@apollo/client';

export type ApolloSubscribeProps<U extends OperationVariables> = { fragment: DocumentNode; variables?: U };
export default function ApolloSubscribe<U extends OperationVariables>({
  fragment,
  variables,
}: ApolloSubscribeProps<U>) {
  useSubscription(fragment, { variables });
  return null;
}
