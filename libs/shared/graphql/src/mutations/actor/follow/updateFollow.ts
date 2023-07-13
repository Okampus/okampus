import { $ } from '../../../zeus';
import { id } from '../../id';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { followBaseInfo } from '../../../selectors/actor/follow/followBase';
import type { ValueTypes } from '../../../zeus';

export const updateFollowMutation = typedGql('mutation')({
  updateFollowByPk: [
    { pkColumns: { id }, _set: $('update', 'FollowSetInput!') as ValueTypes['FollowSetInput'] },
    followBaseInfo,
  ],
});
