import { RoleProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Team } from '../org/team/team.entity';

export type RoleOptions = RoleProps &
  TenantScopedOptions & {
    team: Team;
  };
