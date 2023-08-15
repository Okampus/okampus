import { nthIndexOf } from '@okampus/shared/utils';
import { print } from 'graphql';
import gql from 'graphql-tag';

import type { DocumentNode } from 'graphql';

export function getFragmentFromQuery(__typename: string, query: DocumentNode, fragmentTypename?: string) {
  const fragmentName = `Get${fragmentTypename ?? __typename}Fragment`;
  const queryString = print(query);

  const fragmentQuery = `fragment ${fragmentName} on ${__typename} {
${queryString.slice(nthIndexOf(queryString, '\n', 2) + 1, queryString.lastIndexOf('\n') - 1)}
}`;

  return gql(fragmentQuery);
}

const queryRegex = /query\s(\w+)\s{/;
export function getSubscriptionFromQuery(query: DocumentNode) {
  const queryString = print(query);

  if (queryString.startsWith('query')) {
    const queryInfo = queryRegex.exec(queryString);
    const subscriptionInfo = queryInfo?.[1] ? `subscription Subscribe${queryInfo[1]}` : 'subscription';

    const fragmentQuery = `${subscriptionInfo} {
${queryString.slice(queryString.indexOf('\n') + 1)}`;
    return gql(fragmentQuery);
  }

  throw new Error(`Query should start with "query": ${queryString}`);
}
