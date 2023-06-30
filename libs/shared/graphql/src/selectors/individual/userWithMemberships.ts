import { userBaseInfo } from './userBase';
import { entityBase } from '../entityBase';
import { teamMemberBaseInfo } from '../team/teamMember/teamMemberBase';
import { projectBaseInfo } from '../project/projectBase';
import { actionBaseInfo } from '../team/action/actionBase';
import { eventBaseInfo } from '../event/eventBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userWithMembershipsInfo = Selector('User')({
  ...userBaseInfo,
  teamMembers: [{ where: { endDate: { _isNull: true } } }, teamMemberBaseInfo],
  eventJoins: [{}, { ...entityBase, state: true, presence: true, actions: [{}, actionBaseInfo], event: eventBaseInfo }],
  actions: [{}, { ...actionBaseInfo, project: projectBaseInfo }],
});
export type UserWithMembershipsInfo = InputType<GraphQLTypes['User'], typeof userWithMembershipsInfo>;
