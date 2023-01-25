import type { ITeamMember } from '../../membership/team-member/team-member.interface';
import { IForm } from '../../ugc/form/form.interface';
import { IOrg } from '../org.interface';
import { TeamProps } from './team.props';

export interface ITeam extends IOrg, TeamProps {
  memberCount: number;
  joinForm?: IForm | null;
  members: ITeamMember[];
  // actor: IActor;
  // orgKind?: OrgKind;
  // parent?: IOrg | null;
}
