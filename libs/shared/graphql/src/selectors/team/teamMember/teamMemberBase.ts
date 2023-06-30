import { teamMemberMinimalInfo } from './teamMemberMinimal';
import { Selector } from '../../../zeus';
import { teamMinimalInfo } from '../teamMinimal';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamMemberBaseInfo = Selector('TeamMember')({
  ...teamMemberMinimalInfo,
  team: teamMinimalInfo,
});
export type TeamMemberBaseInfo = InputType<GraphQLTypes['TeamMember'], typeof teamMemberBaseInfo>;
