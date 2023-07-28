import type { Team } from '../team/team.entity';
import type { CohortProps } from './cohort.props';
import type { TenantScopedOptions } from '../tenant-scoped.options';

export type CohortOptions = CohortProps &
  TenantScopedOptions & {
    team: Team;
  };
