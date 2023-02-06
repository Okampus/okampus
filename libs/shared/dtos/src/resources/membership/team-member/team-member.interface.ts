import type { ITeamAction } from '../../manage-team/team-action/team-action.interface';
import type { ITeam } from '../../org/team/team.interface';
import type { ITeamRole } from '../../role/team-role/team-role.interface';
import type { IMembership } from '../membership.interface';
import type { TeamMemberProps } from './team-member.props';

export type ITeamMember = IMembership &
  TeamMemberProps & {
    team?: ITeam;
    roles?: ITeamRole[];
    activities: ITeamAction[];
  };
