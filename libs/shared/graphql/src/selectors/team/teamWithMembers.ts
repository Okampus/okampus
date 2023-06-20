import { teamBaseInfo } from './teamBase';
import { roleBaseInfo } from './role/roleBase';
import { teamMemberWithUser } from './teamMember/teamMemberWithUser';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const teamWithMembersInfo = Selector('Team')({
  ...teamBaseInfo,
  roles: [{}, roleBaseInfo],
  teamMembers: [{}, teamMemberWithUser],
});
export type TeamWithMembersInfo = InputType<GraphQLTypes['Team'], typeof teamWithMembersInfo>;
