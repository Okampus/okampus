import { Selector } from '../../../zeus';
import { roleBaseInfo } from '../role/roleBase';
import { entityBase } from '../../entityBase';
// import { teamBaseInfo } from '../teamBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamMemberMinimalInfo = Selector('TeamMember')({
  ...entityBase,
  startDate: true,
  endDate: true,
  teamMemberRoles: [{}, { role: roleBaseInfo }],
});
export type TeamMemberMinimalInfo = InputType<GraphQLTypes['TeamMember'], typeof teamMemberMinimalInfo>;
