import { userWithMembershipsInfo } from './userWithMemberships';
import { individualMeInfo } from './individualMe';
import { actorBaseInfo } from '../actor/actorBase';
import { eventJoinWithEventInfo } from '../event/eventJoin/eventJoinWithEvent';
import { tenantDetailsInfo } from '../tenant/tenantDetails';
import { teamJoinBaseInfo } from '../team/teamJoin/teamJoinBase';
import { actionWithProjectInfo } from '../team/action/actionWithProject';
import { Selector } from '../../zeus';
import type { InputType, GraphQLTypes } from '../../zeus';

export const userLoginInfo = Selector('UserLogin')({
  __typename: true,
  user: {
    ...userWithMembershipsInfo,
    eventJoins: [{}, eventJoinWithEventInfo],
    teamJoins: [{}, teamJoinBaseInfo],
    shortcuts: [{}, { __typename: true, id: true, createdAt: true, type: true, actor: actorBaseInfo }],
    individual: individualMeInfo,
    tenant: tenantDetailsInfo,
    actions: [{}, actionWithProjectInfo],
  },
  canManageTenant: true,
});
export type UserLoginInfo = InputType<GraphQLTypes['UserLogin'], typeof userLoginInfo>;
