import type { PoleProps } from './pole.props';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Team } from '../team.entity';

export type PoleOptions = PoleProps &
  TenantScopedOptions & {
    team: Team;
    isRequired?: boolean;
  };
