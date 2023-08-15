import { API_URL, HASURA_URL, HASURA_WS_URL } from './consts';
import { getTenantFromHost } from '../utils/headers/get-tenant-from-host';

import { HEADER_TENANT_NAME } from '@okampus/shared/consts';

import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';

import { createUploadLink } from 'apollo-upload-client';
import { createClient } from 'graphql-ws';

const parseHeaders = (rawHeaders: string): Headers => {
  const headers = new Headers();
  const preProcessedHeaders = rawHeaders.replaceAll(/\r?\n[\t ]+/g, ' ');
  const preProcessedHeadersList = preProcessedHeaders.split(/\r?\n/);
  for (const preProcessedHeader of preProcessedHeadersList) {
    const parts = preProcessedHeader.split(':');
    const key = parts.shift()?.trim();

    if (key) headers.append(key, parts.join(':').trim());
  }

  return headers;
};

type OnloadOptions = { status: number; statusText: string; headers: Headers } & Record<string, unknown>;
type CustomFetchOptions = RequestInit & {
  useUpload: boolean;
  onProgress?: (ev: ProgressEvent) => void;
  onAbortPossible?: (abortHandler: () => void) => void;
};

export const uploadFetch = (url: URL | RequestInfo, options: CustomFetchOptions): Promise<Response> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      const headers = parseHeaders(xhr.getAllResponseHeaders() || '');
      const url = 'responseURL' in xhr ? xhr.responseURL : headers.get('X-Request-URL');
      const opts: OnloadOptions = { ...xhr, headers, url };
      const body = xhr.response || xhr.responseText;
      resolve(new Response(body, opts));
    });

    xhr.addEventListener('error', () => reject(new TypeError('Network request failed')));
    xhr.addEventListener('timeout', () => reject(new TypeError('Network request failed')));

    xhr.open(options.method ?? '', url as string, true);
    xhr.withCredentials = options.credentials === 'include';
    for (const [headerName, headerValue] of Object.entries(options.headers ?? {}))
      xhr.setRequestHeader(headerName, headerValue);

    if (xhr.upload && options.onProgress) xhr.upload.addEventListener('progress', options.onProgress);
    if (options.onAbortPossible) options.onAbortPossible(() => xhr.abort());

    xhr.send(options.body as XMLHttpRequestBodyInit | Document | null | undefined);
  });

export const customFetch = (uri: URL | RequestInfo, options: CustomFetchOptions): Promise<Response> => {
  if (options.useUpload) return uploadFetch(uri, options);
  return fetch(uri, options);
};

const tenantContext = setContext((_, context) => {
  return {
    ...context,
    headers: { ...context.headers, [HEADER_TENANT_NAME]: getTenantFromHost(window.location.hostname) }, // TODO: improve tenant detection
  };
});

const apiUploadLink = createUploadLink({ uri: `${API_URL}/graphql`, credentials: 'include', fetch: customFetch });
const hasuraHttpLink = new HttpLink({ uri: `${HASURA_URL}/v1/graphql`, credentials: 'include' });

const hasuraWsLink = new GraphQLWsLink(createClient({ url: `${HASURA_WS_URL}/v1/graphql` }));
export const apolloSplitLink = ApolloLink.split(
  ({ query, getContext }) => {
    if (getContext().useApi) return false;

    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  hasuraWsLink,
  ApolloLink.split(
    ({ query, getContext }) => {
      if (getContext().useApi) return false;

      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'query';
    },
    hasuraHttpLink,
    // @ts-ignore - TODO: invalid type of createUploadLink
    apiUploadLink,
  ),
);

export const apolloClient = new ApolloClient({
  // eslint-disable-next-line unicorn/prefer-spread
  link: ApolloLink.from([tenantContext.concat(apolloSplitLink)]),
  cache: new InMemoryCache({
    typePolicies: {
      Event: { keyFields: ['slug'] },
      Project: { keyFields: ['slug'] },
      Team: { keyFields: ['actor', ['slug']] },
      Tenant: { keyFields: ['domain'] },
      User: { keyFields: ['individual', ['actor', ['slug']]] },
      UserLogin: { keyFields: ['user', ['individual', ['actor', ['slug']]]] },
    },
  }),
});

export type CacheIdWhere =
  | { id: string }
  | { slug: string } // Event, Project
  | { actor: { slug: string } } // Team
  | { domain: string } // Tenant
  | { individual: { actor: { slug: string } } } // User
  | { user: { individual: { actor: { slug: string } } } }; // UserLogin
