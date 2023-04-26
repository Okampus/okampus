import type { PoleProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';

export type PoleOptions = PoleProps &
  TenantScopedOptions & {
    team: Team;
    required?: boolean;
  };
