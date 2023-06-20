import type { User } from '../../individual/user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { TeamMemberProps } from '@okampus/shared/dtos';

export type TeamMemberOptions = TeamMemberProps &
  TenantScopedOptions & {
    startDate?: Date;
    user: User;
    team: Team;
    roles: Role[];
  };
