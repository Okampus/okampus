import type { User } from '../../user/user.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { EventOrganize } from '../event-organize/event-organize.entity';

export type EventSupervisorOptions = TenantScopedOptions & {
  eventOrganize: EventOrganize;
  user: User;
  title?: string;
};
