import { followBaseInfo } from '../../../selectors/actor/follow/followBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import type { ValueTypes } from '../../../zeus';

// @ts-expect-error - Zeus depth limit
export const insertFollowMutation = typedGql('mutation')({
  insertFollowOne: [{ object: $('insert', 'FollowInsertInput!') as ValueTypes['FollowInsertInput'] }, followBaseInfo],
});
