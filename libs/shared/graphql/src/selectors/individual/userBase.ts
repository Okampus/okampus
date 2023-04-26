import { individualBaseInfo } from './individualBase';
import { Selector } from '../../zeus';

import { entityBase } from '../entityBase';
import type { InputType, GraphQLTypes } from '../../zeus';

export const userBaseInfo = Selector('UserInfo')({
  ...entityBase,
  firstName: true,
  lastName: true,
  createdAt: true,
  individualById: individualBaseInfo,
  tenantId: true,
});
export type UserBaseInfo = InputType<GraphQLTypes['UserInfo'], typeof userBaseInfo>;
