'use client';

import { writeFragment } from '../../utils/apollo/write-fragment';
import { isNonNullObject } from '@apollo/client/utilities';

export type ApolloWriteCacheProps = { values: ReadonlyArray<[unknown, Record<string, unknown>]> };
export default function ApolloWriteCache({ values }: ApolloWriteCacheProps) {
  for (const [value, fragment] of values) {
    if (isNonNullObject(value) && '__typename' in value) {
      const __typename = value.__typename;
      const data = value;
      writeFragment({ __typename, data, fragment });
    }
  }
  return null;
}
