import { Selector } from '../../../zeus';
import { roleBaseInfo } from '../role/roleBase';
import { entityBase } from '../../entityBase';
import { teamBaseInfo } from '../teamBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const teamMemberBaseInfo = Selector('TeamMember')({
  ...entityBase,
  startDate: true,
  endDate: true,
  teamMemberRoles: [{}, { role: roleBaseInfo }],
  team: teamBaseInfo,
});
export type TeamMemberBaseInfo = InputType<GraphQLTypes['TeamMember'], typeof teamMemberBaseInfo>;
