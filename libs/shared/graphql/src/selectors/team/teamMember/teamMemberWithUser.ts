import { teamMemberBaseInfo } from './teamMemberBase';
import { Selector } from '../../../zeus';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamMemberWithUser = Selector('TeamMember')({
  ...teamMemberBaseInfo,
  user: userBaseInfo,
});
export type TeamMemberWithUser = InputType<GraphQLTypes['TeamMember'], typeof teamMemberWithUser>;
