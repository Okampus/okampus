'use server';

import { API_URL, HASURA_URL } from '../context/consts';
import { getTenantFromHost } from '../utils/headers/get-tenant-from-host';

import { HEADER_TENANT_NAME } from '@okampus/shared/consts';

import axios from 'axios';
import { print } from 'graphql';
import { headers as nextHeaders } from 'next/headers';

import type { OperationVariables } from '@apollo/client';
import type { DocumentNode } from 'graphql';

export type GetApolloQueryOptions<U extends OperationVariables> = {
  query: DocumentNode;
  variables?: U;
  onApi?: boolean;
  inDomain?: boolean;
};

export async function getApolloQuery<T, U extends OperationVariables>({
  query,
  variables,
  onApi = false,
  inDomain = true,
}: GetApolloQueryOptions<U>): Promise<T> {
  type ReturnType = { data: T; errors: Record<string, unknown>[] };

  const keepHeaders = { cookie: nextHeaders().get('cookie'), 'user-agent': nextHeaders().get('user-agent') };
  const headers = inDomain
    ? { [HEADER_TENANT_NAME]: getTenantFromHost(nextHeaders().get('host') ?? ''), ...keepHeaders }
    : keepHeaders;

  const url = onApi ? API_URL : `${HASURA_URL}/v1`;

  return await axios
    .post<ReturnType>(`${url}/graphql`, { query: print(query), variables }, { withCredentials: true, headers })
    .then((response) => {
      if (response.data.errors) throw new Error(JSON.stringify(response.data.errors));
      return response.data.data;
    });
}
