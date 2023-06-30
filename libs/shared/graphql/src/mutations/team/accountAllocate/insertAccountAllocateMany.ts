import { accountAllocateBaseInfo } from '../../../selectors/team/accountAllocate/accountAllocateBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import type { ResolverInputTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertAccountAllocateManyMutation = typedGql('mutation')({
  insertAccountAllocate: [
    {
      objects: $('objects', '[AccountAllocateInsertInput!]!') as unknown as Array<
        ResolverInputTypes['AccountAllocateInsertInput']
      >,
    },
    { returning: accountAllocateBaseInfo },
  ],
});
