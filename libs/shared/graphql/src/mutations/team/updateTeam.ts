import { teamWithMembersInfo } from '../../selectors/team/teamWithMembers';
import { $ } from '../../zeus';
import { id } from '../id';
import { typedGql } from '../../zeus/typedDocumentNode';

import type { ValueTypes } from '../../zeus';

// @ts-ignore
export const updateTeamMutation = typedGql('mutation')({
  updateTeamByPk: [
    { pkColumns: { id }, _set: $('update', 'TeamSetInput!') as ValueTypes['TeamSetInput'] },
    teamWithMembersInfo,
  ],
});
