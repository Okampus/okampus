import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { TeamHistoryProps } from './team-history.props';

export type TeamHistoryOptions = TeamHistoryProps &
  TenantScopedOptions & {
    team: Team;
  };
