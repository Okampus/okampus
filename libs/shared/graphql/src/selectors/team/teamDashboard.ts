import { teamBaseInfo } from './teamBase';
import { teamMemberWithUserInfo } from './teamMember/teamMemberWithUser';
import { Selector, TeamMemberSelectColumn } from '../../zeus';
import { documentBaseInfo } from '../document/documentBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const teamDashboardInfo = Selector('Team')({
  ...teamBaseInfo,
  currentFinance: true,
  teamMembersAggregate: [
    { limit: 3 },
    { aggregate: { count: [{ columns: [TeamMemberSelectColumn.id] }, true] }, nodes: teamMemberWithUserInfo },
  ],
  documents: [{ limit: 3 }, documentBaseInfo],
});
export type TeamDashboardInfo = InputType<GraphQLTypes['Team'], typeof teamDashboardInfo>;
