import type { ITeamCategory } from '../../label/team-category/team-category.interface';
import type { IFinance } from '../../manage-team/finance/finance.interface';
import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import type { ITeamRole } from '../../role/team-role/team-role.interface';
import type { IForm } from '../../ugc/form/form.interface';
import type { IOrg } from '../org.interface';
import { TeamProps } from './team.props';

export interface ITeam extends IOrg, TeamProps {
  memberCount: number;
  joinForm?: IForm | null;
  members: ITeamMember[];
  roles: ITeamRole[];
  categories: ITeamCategory[];
  finances: IFinance[];
}
