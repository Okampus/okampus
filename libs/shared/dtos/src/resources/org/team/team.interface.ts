import type { ITeamJoin } from '../../join/team-join/team-join.interface';
import type { ITeamCategory } from '../../label/team-category/team-category.interface';
import type { IFinance } from '../../manage-team/finance/finance.interface';
import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import type { ITeamRole } from '../../role/team-role/team-role.interface';
import type { IForm } from '../../ugc/form/form.interface';
import type { IOrg } from '../org.interface';
import type { TeamProps } from './team.props';

export interface ITeam extends IOrg, Required<TeamProps> {
  memberCount: number;
  joinForm?: IForm;
  members: ITeamMember[];
  roles: ITeamRole[];
  joins: ITeamJoin[];
  categories: ITeamCategory[];
  finances: IFinance[];
}
