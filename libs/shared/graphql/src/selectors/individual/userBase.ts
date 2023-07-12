import { individualBaseInfo } from './individualBase';
import { entityBase } from '../entityBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userBaseInfo = Selector('User')({
  ...entityBase,
  firstName: true,
  lastName: true,
  individual: individualBaseInfo,
  tenantId: true,
});
export type UserBaseInfo = InputType<GraphQLTypes['User'], typeof userBaseInfo>;
