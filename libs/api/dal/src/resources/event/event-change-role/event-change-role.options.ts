import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { EventJoin } from '../event-join/event-join.entity';
import type { EventRole } from '../event-role/event-role.entity';
import type { Event } from '../event.entity';
import type { EventChangeRoleProps } from '@okampus/shared/dtos';

export type EventChangeRoleOptions = EventChangeRoleProps &
  TenantScopedOptions & {
    event: Event;
    eventJoin: EventJoin;
    receivedRole?: EventRole | null;
  };
