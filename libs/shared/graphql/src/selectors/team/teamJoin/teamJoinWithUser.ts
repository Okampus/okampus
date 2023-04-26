import { teamJoinBaseInfo } from './teamJoinBase';
import { Selector } from '../../../zeus';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamJoinWithUserInfo = Selector('TeamJoin')({
  ...teamJoinBaseInfo,
  userInfo: userBaseInfo,
});
export type TeamJoinWithUserInfo = InputType<GraphQLTypes['TeamJoin'], typeof teamJoinWithUserInfo>;
