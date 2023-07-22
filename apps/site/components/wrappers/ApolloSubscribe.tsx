'use client';

import { typedGql } from '@okampus/shared/graphql';
import { useSubscription } from '@apollo/client';
import type { ValueTypes } from '@okampus/shared/graphql';

export type ApolloSubscribeProps<Z extends ValueTypes['Subscription']> = { selector: Z };
export default function ApolloSubscribe<Z extends ValueTypes['Subscription']>({ selector }: ApolloSubscribeProps<Z>) {
  // @ts-ignore
  useSubscription(typedGql('subscription')(selector));
  return null;
}
