'use client';

// import ApolloSubscribe from './ApolloSubscribe';
import ApolloWriteCache from './ApolloWriteCache';

import { apolloClient } from '../../_context/apollo';
import { meSlugAtom } from '../../_context/global';

// import { getSubscriptionFromQuery } from '../../../utils/apollo/get-from-query';

import { GetMeDocument } from '@okampus/shared/graphql';
import { ApolloProvider } from '@apollo/client';

import { useAtom } from 'jotai';

import type { MeInfo } from '../../../utils/apollo/fragments';

export type ApolloJotaiInitializeMeProps = {
  me: MeInfo;
  children: React.ReactNode;
};

// const SubscribeMeDocument = getSubscriptionFromQuery(GetMeDocument);

export default function ApolloInitializeMe({ me, children }: ApolloJotaiInitializeMeProps) {
  const [, setMeSlug] = useAtom(meSlugAtom);
  setMeSlug(me.slug);

  return (
    <ApolloProvider client={apolloClient}>
      <ApolloWriteCache values={[[me, GetMeDocument]]} data-superjson />
      {/* <ApolloSubscribe fragment={SubscribeMeDocument} data-superjson /> */}
      {children}
    </ApolloProvider>
  );
}
