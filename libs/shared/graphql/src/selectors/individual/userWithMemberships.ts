import { userBaseInfo } from './userBase';
import { teamMemberBaseInfo } from '../team/teamMember/teamMemberBase';
import { actionWithProjectInfo } from '../team/action/actionWithProject';
import { Selector } from '../../zeus';
import { eventJoinWithEventInfo } from '../event/eventJoin/eventJoinWithEvent';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userWithMembershipsInfo = Selector('User')({
  ...userBaseInfo,
  teamMembers: [{ where: { endDate: { _isNull: true } } }, teamMemberBaseInfo],
  eventJoins: [{}, eventJoinWithEventInfo],
  actions: [{}, actionWithProjectInfo],
});
export type UserWithMembershipsInfo = InputType<GraphQLTypes['User'], typeof userWithMembershipsInfo>;
