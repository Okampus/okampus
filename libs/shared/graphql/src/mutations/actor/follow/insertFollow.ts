import { followBaseInfo } from '../../../selectors/actor/follow/followBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { $ } from '../../../zeus';

import type { ValueTypes } from '../../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertFollowMutation = typedGql('mutation')({
  insertFollowOne: [{ object: $('insert', 'FollowInsertInput!') as ValueTypes['FollowInsertInput'] }, followBaseInfo],
});
