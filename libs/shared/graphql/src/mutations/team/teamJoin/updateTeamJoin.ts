import { teamJoinBaseInfo } from '../../../selectors/team/teamJoin/teamJoinBase';
import { $ } from '../../../zeus';
import { id } from '../../id';
import { typedGql } from '../../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../../zeus';

export const updateTeamJoin = typedGql('mutation')({
  updateTeamJoinByPk: [
    {
      pkColumns: { id },
      _set: $('update', 'TeamJoinSetInput!') as ValueTypes['TeamJoinSetInput'],
    },
    teamJoinBaseInfo,
  ],
});
