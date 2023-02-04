import type { TeamMemberProps } from '@okampus/shared/dtos';
import type { Team } from '../../org/team/team.entity';
import type { TeamRole } from '../../role/team-role/team-role.entity';
import type { MembershipOptions } from '../membership.options';

export type TeamMemberOptions = TeamMemberProps &
  MembershipOptions & {
    team: Team;
    roles: TeamRole[];
  };
