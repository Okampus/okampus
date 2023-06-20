import { userWithMembershipsInfo } from './userWithMemberships';
import { individualBaseInfo } from './individualBase';
import { actorBaseInfo } from '../actor/actorBase';
import { tenantDetailsInfo } from '../tenant/tenantDetails';
import { teamJoinBaseInfo } from '../team/teamJoin/teamJoinBase';

import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userMeInfo = Selector('User')({
  ...userWithMembershipsInfo,
  teamJoins: [{}, teamJoinBaseInfo],
  shortcuts: [{}, { __typename: true, id: true, createdAt: true, type: true, actor: actorBaseInfo }],
  individual: { ...individualBaseInfo, following: [{}, { ...entityBase, actor: actorBaseInfo }] },
  tenant: tenantDetailsInfo,
});
export type UserMeInfo = InputType<GraphQLTypes['User'], typeof userMeInfo>;
