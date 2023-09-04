import type { TeamMemberProps } from './team-member.props';
import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { User } from '../../user/user.entity';

export type TeamMemberOptions = TeamMemberProps &
  TenantScopedOptions & {
    user: User;
    team: Team;
  };
