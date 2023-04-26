import { userBaseInfo } from './userBase';
import { Selector } from '../../zeus';

import { teamMemberBaseInfo } from '../team/teamMember/teamMemberBase';
import { TeamType } from '@okampus/shared/enums';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userWithMembershipsInfo = Selector('UserInfo')({
  ...userBaseInfo,
  teamMembers: [
    { where: { endDate: { _isNull: true }, team: { type: { _eq: TeamType.Association } } } },
    teamMemberBaseInfo,
  ],
});
export type UserWithMembershipsInfo = InputType<GraphQLTypes['UserInfo'], typeof userWithMembershipsInfo>;
