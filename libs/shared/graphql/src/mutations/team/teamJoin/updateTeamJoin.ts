import { teamJoinBaseInfo } from '../../../selectors/team/teamJoin/teamJoinBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../../zeus';

export const updateTeamJoin = typedGql('mutation')({
  updateTeamJoinByPk: [
    { pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'TeamJoinSetInput!') as ValueTypes['TeamJoinSetInput'] },
    teamJoinBaseInfo,
  ],
});
