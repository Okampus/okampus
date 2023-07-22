import { apolloClient } from '../../context/apollo';
import { typedGql } from '@okampus/shared/graphql';
import type { CacheIdWhere } from '../../context/apollo';

export type WriteFragmentOptions = {
  __typename: string;
  data: Record<string, unknown>;
  fragment: Record<string, unknown>;
  where?: CacheIdWhere;
};
export function writeFragment({ __typename, data, fragment, where }: WriteFragmentOptions) {
  apolloClient.cache.writeFragment({
    id: apolloClient.cache.identify({ __typename, ...(where ?? data) }),
    data,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fragment: typedGql(`fragment Hydrate${__typename} on ${__typename}` as any)(fragment),
  });
}

// TODO: typings struggle; improve them
// import type { GraphQLTypes, ValueTypes } from '@okampus/shared/graphql';
// export type WriteFragmentOptions<O extends keyof GraphQLTypes, Z extends GraphQLTypes[O]> = {
//   __typename: O;
//   data: Z;
//   where?: CacheIdWhere;
// };
// export function writeFragment<O extends keyof ValueTypes, Z extends GraphQLTypes[O]>({
//   __typename,
//   data,
//   where,
// }: WriteFragmentOptions<O, Z>) {
//   const fragmentName = `Hydrate${__typename}Fragment`;
//   apolloClient.cache.writeFragment({
//     /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
//     // @ts-ignore - Zeus infinite type instanciation
//     id: apolloClient.cache.identify({ __typename, ...(where ?? data) }),
//     data,
//     fragment: typedGql(`fragment ${fragmentName} on ${__typename}` as any)(data),
//   });
// }
