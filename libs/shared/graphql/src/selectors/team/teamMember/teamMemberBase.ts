import { Selector } from '../../../zeus';
import { roleBaseInfo } from '../role/roleBase';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamMemberBaseInfo = Selector('TeamMember')({
  ...entityBase,
  startDate: true,
  endDate: true,
  teamMemberRoles: [{}, { role: roleBaseInfo }],
});
export type TeamMemberBaseInfo = InputType<GraphQLTypes['TeamMember'], typeof teamMemberBaseInfo>;
