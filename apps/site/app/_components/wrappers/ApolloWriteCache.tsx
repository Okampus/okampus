'use client';

import { getFragmentFromQuery } from '../../../utils/apollo/get-from-query';
import { writeFragment } from '../../../utils/apollo/write-fragment';

import { isNonNullObject } from '@apollo/client/utilities';
import type { DocumentNode } from 'graphql';

export type ApolloWriteCacheProps = { values: ReadonlyArray<[unknown, DocumentNode]> };
export default function ApolloWriteCache({ values }: ApolloWriteCacheProps) {
  for (const [value, fragment] of values) {
    if (isNonNullObject(value) && '__typename' in value) {
      const __typename = value.__typename;
      const data = value;
      writeFragment({ __typename, data, fragment: getFragmentFromQuery(__typename, fragment) });
    }
  }
  return null;
}
