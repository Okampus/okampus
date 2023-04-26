import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { TeamJoin } from '../team-join/team-join.entity';
import type { Team } from '../team.entity';
import type { Pole } from '../pole/pole.entity';
import type { Role } from '../role/role.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ChangeRoleProps } from '@okampus/shared/dtos';

export type ChangeRoleOptions = ChangeRoleProps &
  TenantScopedOptions & {
    team: Team;
    user: UserInfo;
    teamJoin?: TeamJoin;
    receivedRole?: Role;
    receivedPole?: Pole;
  };
