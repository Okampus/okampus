import type { Event } from '../event/event.entity';
import type { Tenant } from '../tenant/tenant.entity';
import type { Team } from '../team/team.entity';
import type { EntityName, EventContext, EventType } from '@okampus/shared/enums';
import type { LogDiff } from '@okampus/shared/types';
import type { User } from '../user/user.entity';

export type LogOptions = {
  eventType: EventType;
  context: EventContext;
  entityName: EntityName;
  entityId: string;
  diff?: LogDiff;
  note?: string;
  team?: Team;
  tenant?: Tenant;
  event?: Event;
  user?: User;
  createdBy?: User | null;
};
