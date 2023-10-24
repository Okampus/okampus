import { hasuraUrlEndpoint, hasuraWsUrl } from '../../config';
import { getTenantFromHost } from '../../utils/host/get-tenant-from-host';

import { HEADER_TENANT_NAME } from '@okampus/shared/consts';

import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';

import { createClient } from 'graphql-ws';

const tenantContext = setContext((_operation, context) => {
  const tenant = context.tenant ?? getTenantFromHost(window.location.hostname);
  return { ...context, headers: { ...context.headers, [HEADER_TENANT_NAME]: tenant } };
});

const hasuraWsLink = new GraphQLWsLink(createClient({ url: hasuraWsUrl }));
const hasuraHttpLink = new HttpLink({ uri: hasuraUrlEndpoint, credentials: 'include' });

export const apolloSplitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  hasuraWsLink,
  hasuraHttpLink,
);

export const apolloClient = new ApolloClient({
  // eslint-disable-next-line unicorn/prefer-spread
  link: ApolloLink.from([tenantContext.concat(apolloSplitLink)]),
  cache: new InMemoryCache({
    typePolicies: {
      Event: { keyFields: ['slug'] },
      Project: { keyFields: ['slug'] },
      Team: { keyFields: ['slug'] },
      Tenant: { keyFields: ['domain'] },
      User: { keyFields: ['slug'] },
      Me: { keyFields: ['user', ['slug']] },
    },
  }),
});

export function getTenantWhere(tenant: { domain: string }) {
  return { domain: tenant.domain };
}

export type CacheIdWhere = { id: string } | { slug: string } | Parameters<typeof getTenantWhere>[0];
