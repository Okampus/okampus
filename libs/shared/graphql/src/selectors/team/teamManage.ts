import { teamWithMembersInfo } from './teamWithMembers';
import { teamJoinWithUserInfo } from './teamJoin/teamJoinWithUser';
import { teamBaseInfo } from './teamBase';
import { Selector } from '../../zeus';
import { eventBaseInfo } from '../event/eventBase';
import { projectBaseInfo } from '../project/projectBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const teamManageInfo = Selector('Team')({
  ...teamWithMembersInfo,
  currentFinance: true,
  teamJoins: [{}, teamJoinWithUserInfo],
  teamEvents: [{}, { event: eventBaseInfo }],
  projects: [{}, projectBaseInfo],
  team: teamBaseInfo,
});
export type TeamManageInfo = InputType<GraphQLTypes['Team'], typeof teamManageInfo>;
