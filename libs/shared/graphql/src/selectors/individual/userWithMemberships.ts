import { userBaseInfo } from './userBase';
import { teamMemberBaseInfo } from '../team/teamMember/teamMemberBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userWithMembershipsInfo = Selector('User')({
  ...userBaseInfo,
  teamMembers: [{ where: { endDate: { _isNull: true } } }, teamMemberBaseInfo],
});
export type UserWithMembershipsInfo = InputType<GraphQLTypes['User'], typeof userWithMembershipsInfo>;
