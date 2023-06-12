import { individualBaseInfo } from './individualBase';
import { entityBase } from '../entityBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userBaseInfo = Selector('UserInfo')({
  ...entityBase,
  firstName: true,
  lastName: true,
  individualById: individualBaseInfo,
  tenantId: true,
});
export type UserBaseInfo = InputType<GraphQLTypes['UserInfo'], typeof userBaseInfo>;
