import { teamJoinBaseInfo } from '../../../selectors/team/teamJoin/teamJoinBase';
import { $ } from '../../../zeus';
import { typedGql } from '../../../zeus/typedDocumentNode';

export const updateTeamJoin = typedGql('mutation')({
  updateTeamJoinByPk: [
    { pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'TeamJoinSetInput!') },
    teamJoinBaseInfo,
  ],
});
