import { accountMinimalInfo } from './accountMinimal';
import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const accountBaseInfo = Selector('Account')({
  ...accountMinimalInfo,
  children: [{}, accountMinimalInfo],
  parent: accountMinimalInfo,
});
export type AccountBaseInfo = InputType<GraphQLTypes['Account'], typeof accountBaseInfo>;
