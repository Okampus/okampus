import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { TeamHistoryProps } from '@okampus/shared/dtos';

export type TeamHistoryOptions = TeamHistoryProps &
  TenantScopedOptions & {
    team: Team;
  };
