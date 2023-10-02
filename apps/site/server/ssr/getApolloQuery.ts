'use server';

import { hasuraUrlEndpoint } from '../../config';
import { getTenantFromHost } from '../../utils/host/get-tenant-from-host';

import { HEADER_TENANT_NAME } from '@okampus/shared/consts';

import axios from 'axios';
import { print } from 'graphql';
import { headers as nextHeaders } from 'next/headers';

import type { OperationVariables } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export type GetApolloQueryOptions<U extends OperationVariables> = {
  query: DocumentNode;
  variables?: U;
  inDomain?: boolean;
};

export async function getApolloQuery<T, U extends OperationVariables>({
  query,
  variables,
  inDomain = true,
}: GetApolloQueryOptions<U>): Promise<{ data: T; errors: null } | { data: null; errors: Record<string, unknown>[] }> {
  type ReturnType = { data: T; errors: Record<string, unknown>[] };

  const keepHeaders = { cookie: nextHeaders().get('cookie'), 'user-agent': nextHeaders().get('user-agent') };
  const headers = inDomain
    ? { [HEADER_TENANT_NAME]: getTenantFromHost(nextHeaders().get('host') ?? ''), ...keepHeaders }
    : keepHeaders;

  return await axios
    .post<ReturnType>(hasuraUrlEndpoint, { query: print(query), variables }, { withCredentials: true, headers })
    .then((response) => {
      if (response.data.errors) return { data: null, errors: response.data.errors };
      return { data: response.data.data, errors: null };
    });
}
