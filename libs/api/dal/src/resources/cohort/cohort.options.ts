import type { Team } from '../team/team.entity';
import type { CohortProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../tenant-scoped.options';

export type CohortOptions = CohortProps &
  TenantScopedOptions & {
    team: Team;
  };
