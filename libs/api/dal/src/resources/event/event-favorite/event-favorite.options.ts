import type { Event } from '../event.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';

export type EventFavoriteOptions = TenantScopedOptions & {
  event: Event;
};
