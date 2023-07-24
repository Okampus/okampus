import { typedGql } from '@okampus/shared/graphql';
import { useFragment } from '@apollo/client';
import type { CacheIdWhere } from '../../context/apollo';
import type { ValueTypes } from '@okampus/shared/graphql';

export type UseTypedFragmentOptions = {
  __typename: keyof ValueTypes;
  selector: Record<string, unknown>;
  where: CacheIdWhere;
};
export function useTypedFragment<T>({ __typename, selector, where }: UseTypedFragmentOptions): T | null {
  const fragmentName = `Get${__typename}Fragment`;
  const { complete, data } = useFragment<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fragment: typedGql(`fragment ${fragmentName} on ${__typename}` as any)(selector) as any,
    fragmentName,
    from: { __typename, ...where },
  });

  return complete && data ? data : null;
}

// TODO: typings struggle; improve them
// export type UseTypedFragmentOptions<O extends keyof ValueTypes, Z extends ValueTypes[O]> = {
//   __typename: O;
//   selector: Z;
//   where: { id: string } | { slug: string } | { actor: { slug: string } };
// };
// export function useTypedFragment<O extends keyof ValueTypes, Z extends ValueTypes[O]>({
//   __typename,
//   selector,
//   where,
// }: UseTypedFragmentOptions<O, Z>): InputType<GraphQLTypes[O], Z> | null {
//   const fragmentName = `Get${__typename}Fragment`;
//   const { complete, data } = useFragment<InputType<GraphQLTypes[O], Z>>({
//     /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
//     // @ts-ignore - Zeus infinite type instanciation
//     fragment: typedGql(`fragment ${fragmentName} on ${__typename}` as any)(selector),
//     fragmentName,
//     from: { __typename, ...where },
//   });
//   return complete && data ? data : null;
// }
