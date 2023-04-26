// eslint-disable-next-line import/no-cycle
import { teamManageInfo } from '../../selectors/team/teamManage';
import { teamWithMembersInfo } from '../../selectors/team/teamWithMembers';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';

// @ts-expect-error - Zeus depth limit
export const updateTeam = typedGql('mutation')({
  updateTeamByPk: [{ pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'TeamSetInput!') }, teamWithMembersInfo],
});

// @ts-expect-error - Zeus depth limit
export const updateTeamManage = typedGql('mutation')({
  updateTeamByPk: [{ pkColumns: { id: $('id', 'bigint!') }, _set: $('update', 'TeamSetInput!') }, teamManageInfo],
});
