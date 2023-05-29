import type { EventAttendanceProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { EventJoin } from '../event-join/event-join.entity';

export type EventAttendanceOptions = EventAttendanceProps &
  TenantScopedOptions & {
    eventJoin: EventJoin;
  };
