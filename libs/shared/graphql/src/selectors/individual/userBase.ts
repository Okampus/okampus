import { userMinimalInfo } from './userMinimal';
import { individualBaseInfo } from './individualBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userBaseInfo = Selector('User')({
  ...userMinimalInfo,
  individual: individualBaseInfo,
});
export type UserBaseInfo = InputType<GraphQLTypes['User'], typeof userBaseInfo>;
