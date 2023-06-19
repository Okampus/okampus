import { userBaseInfo } from './userBase';
import { entityBase } from '../entityBase';
import { projectBaseInfo } from '../project/projectBase';
import { actionBaseInfo } from '../team/action/actionBase';
import { teamMemberBaseInfo } from '../team/teamMember/teamMemberBase';
import { eventBaseInfo } from '../event/eventBase';
import { Selector } from '../../zeus';

import { TeamType } from '@okampus/shared/enums';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userWithMembershipsInfo = Selector('UserInfo')({
  ...userBaseInfo,
  teamMembers: [
    { where: { endDate: { _isNull: true }, team: { type: { _eq: TeamType.Association } } } },
    teamMemberBaseInfo,
  ],
  eventJoins: [{}, { ...entityBase, state: true, presence: true, action: actionBaseInfo, event: eventBaseInfo }],
  actions: [{}, { ...actionBaseInfo, project: projectBaseInfo }],
});
export type UserWithMembershipsInfo = InputType<GraphQLTypes['UserInfo'], typeof userWithMembershipsInfo>;
