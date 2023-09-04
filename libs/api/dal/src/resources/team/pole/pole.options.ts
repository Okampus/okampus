import type { PoleProps } from './pole.props';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { Team } from '../team.entity';

export type PoleOptions = PoleProps &
  TenantScopedOptions & {
    team: Team;
    required?: boolean;
  };
