import { teamBaseInfo } from './teamBase';
import { accountBaseInfo } from './account/accountBase';
import { teamMemberWithUser } from './teamMember/teamMemberWithUser';
import { Selector, TeamMemberSelectColumn } from '../../zeus';
import { documentBaseInfo } from '../document/documentBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const teamDashboardInfo = Selector('Team')({
  ...teamBaseInfo,
  accounts: [{}, accountBaseInfo],
  teamMembersAggregate: [
    { limit: 3 },
    { aggregate: { count: [{ columns: [TeamMemberSelectColumn.id] }, true] }, nodes: teamMemberWithUser },
  ],
  documents: [{ limit: 3 }, documentBaseInfo],
});
export type TeamDashboardInfo = InputType<GraphQLTypes['Team'], typeof teamDashboardInfo>;
