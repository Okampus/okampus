'use client';

import ApolloWriteCache from './ApolloWriteCache';

import { apolloClient } from '../../_context/apollo';
import { meSlugAtom } from '../../_context/global';

import { GetMeDocument, GetTenantDocument } from '@okampus/shared/graphql';
import { ApolloProvider } from '@apollo/client';

import { useAtom } from 'jotai';

import type { MeInfo, TenantInfo } from '../../../utils/apollo/fragments';

export type ApolloJotaiInitializeProps = { me: MeInfo; tenant: TenantInfo; children: React.ReactNode };

export default function ApolloJotaiInitialize({ me, tenant, children }: ApolloJotaiInitializeProps) {
  const [, setMeSlug] = useAtom(meSlugAtom);
  setMeSlug(me.slug);

  return (
    <ApolloProvider client={apolloClient}>
      <ApolloWriteCache
        values={[
          [me, GetMeDocument],
          [tenant, GetTenantDocument],
        ]}
        data-superjson
      />
      {children}
    </ApolloProvider>
  );
}
