import { userMinimalInfo } from './userMinimal';
import { individualMinimalInfo } from './individualMinimal';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userBaseInfo = Selector('User')({
  ...userMinimalInfo,
  individual: individualMinimalInfo,
});
export type UserBaseInfo = InputType<GraphQLTypes['User'], typeof userBaseInfo>;
