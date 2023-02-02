import { TeamMemberProps } from '@okampus/shared/dtos';
import { Team } from '../../org/team/team.entity';
import { TeamRole } from '../../role/team-role/team-role.entity';
import { MembershipOptions } from '../membership.options';

export type TeamMemberOptions = TeamMemberProps &
  MembershipOptions & {
    team: Team;
    roles: TeamRole[];
  };
