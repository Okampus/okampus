import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { TeamMemberProps } from '@okampus/shared/dtos';

export type TeamMemberOptions = TeamMemberProps &
  TenantScopedOptions & {
    startDate?: Date;
    user: UserInfo;
    team: Team;
    roles: Role[];
  };
