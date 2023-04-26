import { teamMemberBaseInfo } from './teamMemberBase';
import { Selector } from '../../../zeus';
import { userBaseInfo } from '../../individual/userBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamMemberWithUserInfo = Selector('TeamMember')({
  ...teamMemberBaseInfo,
  userInfo: userBaseInfo,
});
export type TeamMemberWithUserInfo = InputType<GraphQLTypes['TeamMember'], typeof teamMemberWithUserInfo>;
