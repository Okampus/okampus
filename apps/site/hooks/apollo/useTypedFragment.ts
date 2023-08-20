import { useFragment } from '@apollo/client';
import type { DocumentNode } from '@apollo/client';
import type { CacheIdWhere } from '../../context/apollo';

export type UseTypedFragmentOptions = {
  __typename: string;
  fragmentTypename?: string;
  fragment: DocumentNode;
  where: CacheIdWhere;
};
export function useTypedFragment<T>({
  __typename,
  fragment,
  fragmentTypename,
  where,
}: UseTypedFragmentOptions): T | null {
  const fragmentName = `Get${fragmentTypename ?? __typename}Fragment`;
  const from = { __typename, ...where };

  const { complete, data, missing } = useFragment<T>({ fragment, fragmentName, from });
  if (missing) console.warn(`Missing data ${JSON.stringify(data)} for ${JSON.stringify(from)}`);
  return complete && data ? data : null;
}
