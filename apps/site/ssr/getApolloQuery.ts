'use server';

import { API_URL, HASURA_URL } from '../context/consts';

import { HEADER_TENANT_NAME } from '@okampus/shared/consts';
import { Zeus } from '@okampus/shared/graphql';
import { getTenantFromHost } from '@okampus/shared/utils';

import axios from 'axios';
import { headers as nextHeaders } from 'next/headers';

import type { ValueTypes } from '@okampus/shared/graphql';

export async function getApolloQuery<T, O extends keyof ValueTypes['Query'] = keyof ValueTypes['Query']>(
  queryName: O,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  onApi = false,
  inDomain = true
): Promise<T> {
  const payload = { query: Zeus('query', { [queryName]: query }) };
  type ReturnType = { data: { [key in typeof queryName]: T | undefined }; errors: Record<string, unknown>[] };

  const keepHeaders = { cookie: nextHeaders().get('cookie'), 'user-agent': nextHeaders().get('user-agent') };
  const headers = inDomain
    ? { [HEADER_TENANT_NAME]: getTenantFromHost(nextHeaders().get('host') ?? ''), ...keepHeaders }
    : keepHeaders;

  return (await axios
    .post<ReturnType>(`${onApi ? API_URL : HASURA_URL}/graphql`, payload, { withCredentials: true, headers })
    .then((response) => {
      if (response.data.errors) throw new Error(JSON.stringify(response.data.errors));
      return response.data.data[queryName];
    })) as Promise<T>;
}

// TODO: typings struggle; improve them
// import type { InputType, ValueTypes, GraphQLTypes } from '@okampus/shared/graphql';

// type ExtractGraphQLType<T> = T extends [unknown, ValueTypes[infer U extends keyof ValueTypes]]
//   ? U
//   : T extends ValueTypes[infer U extends keyof ValueTypes]
//   ? U
//   : never;

// export async function getApolloQuery<O extends keyof ValueTypes['Query'], Z extends ValueTypes['Query'][O]>(
//   queryName: O,
//   query: Z
// ): Promise<InputType<GraphQLTypes[ExtractGraphQLType<Z>], Z>> {
//   const payload = { query: Zeus('query', { [queryName]: query }) };
//   type ReturnType = { [key in typeof queryName]: InputType<GraphQLTypes[ExtractGraphQLType<Z>], Z> };

//   // @ts-ignore - type instanciation is infinite
//   return await axios.post<ReturnType>(`${API_URL}/graphql`, payload).then((response) => {
//     return response.data[queryName];
//   });
// }
