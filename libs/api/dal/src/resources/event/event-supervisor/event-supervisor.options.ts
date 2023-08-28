import type { User } from '../../user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { EventOrganize } from '../event-organize/event-organize.entity';

export type EventSupervisorOptions = TenantScopedOptions & {
  eventOrganize: EventOrganize;
  user: User;
  title?: string;
};
