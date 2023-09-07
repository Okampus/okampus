import type { Event } from '../event.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';

export type EventFavoriteOptions = TenantScopedOptions & {
  event: Event;
};
