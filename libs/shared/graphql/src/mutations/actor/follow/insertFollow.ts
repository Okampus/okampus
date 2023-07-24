import { followBaseInfo } from '../../../selectors/actor/follow/followBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import type { ValueTypes } from '../../../zeus';

// @ts-ignore
export const insertFollowMutation = typedGql('mutation')({
  insertFollowOne: [{ object: $('object', 'FollowInsertInput!') as ValueTypes['FollowInsertInput'] }, followBaseInfo],
});
