import type { ITeamAction } from '../../manage-team/team-action/team-action.interface';
import { ITeam } from '../../org/team/team.interface';
import { ITeamRole } from '../../role/team-role/team-role.interface';
import { IMembership } from '../membership.interface';
import { TeamMemberProps } from './team-member.props';

export type ITeamMember = IMembership &
  TeamMemberProps & {
    team?: ITeam;
    roles?: ITeamRole[];
    activities: ITeamAction[];
  };
