import { teamJoinBaseInfo } from './teamJoinBase';
import { Selector } from '../../../zeus';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamJoinWithUser = Selector('TeamJoin')({ ...teamJoinBaseInfo, user: userBaseInfo });
export type TeamJoinWithUser = InputType<GraphQLTypes['TeamJoin'], typeof teamJoinWithUser>;
