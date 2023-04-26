import { userWithMembershipsInfo } from './userWithMemberships';
import { Selector } from '../../zeus';

import { actorBaseInfo } from '../actor/actorBase';
import { tenantBaseInfo } from '../tenant/tenantBase';
import { teamJoinBaseInfo } from '../team/teamJoin/teamJoinBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userMeInfo = Selector('UserInfo')({
  ...userWithMembershipsInfo,
  teamJoins: [{}, teamJoinBaseInfo],
  shortcuts: [{}, { __typename: true, id: true, createdAt: true, type: true, actor: actorBaseInfo }],
  tenant: tenantBaseInfo,
});
export type UserMeInfo = InputType<GraphQLTypes['UserInfo'], typeof userMeInfo>;
