import type { Team } from '../../team/team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Event } from '../event.entity';

export type EventManageOptions = TenantScopedOptions & {
  activities?: string;
  event: Event;
  team: Team;
};
