import { userBaseInfo } from './userBase';
import { teamMemberBaseInfo } from '../team/teamMember/teamMemberBase';
import { actionWithProjectInfo } from '../team/action/actionWithProject';
import { Selector } from '../../zeus';
import { eventJoinDetailsInfo } from '../event/eventJoin/eventJoinDetails';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userWithMembershipsInfo = Selector('User')({
  ...userBaseInfo,
  teamMembers: [{ where: { endDate: { _isNull: true } } }, teamMemberBaseInfo],
  eventJoins: [{}, eventJoinDetailsInfo],
  actions: [{}, actionWithProjectInfo],
});
export type UserWithMembershipsInfo = InputType<GraphQLTypes['User'], typeof userWithMembershipsInfo>;
