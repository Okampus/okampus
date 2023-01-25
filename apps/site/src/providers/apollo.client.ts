import { ApolloClient, ApolloLink } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { createUploadLink } from 'apollo-upload-client';
import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { setContext } from '@apollo/client/link/context';
import { currentTenant } from '../utils/current-tenant';

const tenantContext = setContext((_, { headers }) => {
  console.log('currentTenant', currentTenant());
  return {
    headers: {
      ...headers,
      [HEADER_TENANT_NAME]: currentTenant(),
    },
  };
});

const uploadLink = createUploadLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`,
  credentials: 'include',
});

export const apolloClient = new ApolloClient({
  // eslint-disable-next-line unicorn/prefer-spread
  link: ApolloLink.from([tenantContext.concat(uploadLink)]),
  cache: new InMemoryCache(),
});
