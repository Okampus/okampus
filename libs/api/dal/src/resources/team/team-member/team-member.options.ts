import type { TeamMemberRole } from '../team-member-role/team-member-role.entity';
import type { User } from '../../individual/user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';
import type { TeamMemberProps } from './team-member.props';

export type TeamMemberOptions = TeamMemberProps &
  TenantScopedOptions & {
    user: User;
    team: Team;
    teamMemberRoles: TeamMemberRole[];
  };
