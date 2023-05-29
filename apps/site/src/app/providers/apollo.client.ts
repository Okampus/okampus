import { API_URL } from '../consts';
import { currentTenant } from '@okampus/ui/utils';
import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { ApolloClient, ApolloLink } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

const parseHeaders = (rawHeaders: string): Headers => {
  const headers = new Headers();
  const preProcessedHeaders = rawHeaders.replaceAll(/\r?\n[\t ]+/g, ' ');
  const preProcessedHeadersList = preProcessedHeaders.split(/\r?\n/);
  for (const preProcessedHeader of preProcessedHeadersList) {
    const parts = preProcessedHeader.split(':');
    const key = parts.shift()?.trim();
    if (key) {
      const value = parts.join(':').trim();
      headers.append(key, value);
    }
  }

  return headers;
};

type OnloadOptions = { status: number; statusText: string; headers: Headers } & Record<string, unknown>;
type CustomFetchOptions = RequestInit & {
  useUpload: boolean;
  onProgress: (ev: ProgressEvent) => void;
  onAbortPossible: (abortHandler: () => void) => void;
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

    xhr.open(options.method || '', url as string, true);
    xhr.withCredentials = options.credentials === 'include';
    for (const [headerName, headerValue] of Object.entries(options.headers || {}))
      xhr.setRequestHeader(headerName, headerValue);

    if (xhr.upload) xhr.upload.addEventListener('progress', options.onProgress);
    options.onAbortPossible(() => xhr.abort());

    xhr.send(options.body as XMLHttpRequestBodyInit | Document | null | undefined);
  });

export const customFetch = (uri: URL | RequestInfo, options: CustomFetchOptions): Promise<Response> => {
  if (options.useUpload) return uploadFetch(uri, options);
  return fetch(uri, options);
};

const tenantContext = setContext((_, context) => {
  return {
    ...context,
    headers: { ...context.headers, [HEADER_TENANT_NAME]: currentTenant() }, // TODO: improve tenant detection
  };
});

const uploadLink = createUploadLink({ uri: `${API_URL}/graphql`, credentials: 'include', fetch: customFetch });

export const apolloClient = new ApolloClient({
  // eslint-disable-next-line unicorn/prefer-spread
  link: ApolloLink.from([tenantContext.concat(uploadLink)]),
  cache: new InMemoryCache(),
});
