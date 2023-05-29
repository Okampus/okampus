import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { followBaseInfo } from '../../../selectors/actor/follow/followBase';
import type { ValueTypes } from '../../../zeus';

export const updateFollow = typedGql('mutation')({
  updateFollowByPk: [
    { pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'FollowSetInput!') as ValueTypes['FollowSetInput'] },
    followBaseInfo,
  ],
});
