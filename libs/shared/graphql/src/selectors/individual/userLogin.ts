import { userWithMembershipsInfo } from './userWithMemberships';
import { individualMeInfo } from './individualMe';
import { actorBaseInfo } from '../actor/actorBase';
import { tenantDetailsInfo } from '../tenant/tenantDetails';
import { teamJoinBaseInfo } from '../team/teamJoin/teamJoinBase';
import { Selector } from '../../zeus';
import type { InputType, GraphQLTypes } from '../../zeus';

export const userLoginInfo = Selector('UserLogin')({
  __typename: true,
  user: {
    ...userWithMembershipsInfo,
    teamJoins: [{}, teamJoinBaseInfo],
    shortcuts: [{}, { __typename: true, id: true, createdAt: true, type: true, actor: actorBaseInfo }],
    individual: individualMeInfo,
    tenant: tenantDetailsInfo,
  },
  canManageTenant: true,
});
export type UserLoginInfo = InputType<GraphQLTypes['UserLogin'], typeof userLoginInfo>;