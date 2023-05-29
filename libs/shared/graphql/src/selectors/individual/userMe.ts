import { userWithMembershipsInfo } from './userWithMemberships';
import { individualBaseInfo } from './individualBase';
import { actorBaseInfo } from '../actor/actorBase';
import { tenantDetailsInfo } from '../tenant/tenantDetails';
import { teamJoinBaseInfo } from '../team/teamJoin/teamJoinBase';

import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userMeInfo = Selector('UserInfo')({
  ...userWithMembershipsInfo,
  teamJoins: [{}, teamJoinBaseInfo],
  shortcuts: [{}, { __typename: true, id: true, createdAt: true, type: true, actor: actorBaseInfo }],
  tenant: tenantDetailsInfo,
  individualById: {
    ...individualBaseInfo,
    follows: [
      {},
      {
        ...entityBase,
        actor: actorBaseInfo,
      },
    ],
  },
});
export type UserMeInfo = InputType<GraphQLTypes['UserInfo'], typeof userMeInfo>;
