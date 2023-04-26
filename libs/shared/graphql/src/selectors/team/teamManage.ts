import { teamWithMembersInfo } from './teamWithMembers';
import { teamJoinWithUserInfo } from './teamJoin/teamJoinWithUser';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const teamManageInfo = Selector('Team')({
  ...teamWithMembersInfo,
  currentFinance: true,
  teamJoins: [{}, teamJoinWithUserInfo],
});
export type TeamManageInfo = InputType<GraphQLTypes['Team'], typeof teamManageInfo>;
