import type { Team } from '../team/team.entity';
import type { EntityName, EventContext, EventType } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { LogDiff } from '@okampus/shared/types';
import type { ContentMaster } from '../content-master/content-master.entity';
import type { Individual } from '../individual/individual.entity';

export type LogOptions = TenantScopedOptions & {
  event: EventType;
  context: EventContext;
  entityName: EntityName;
  entityId: string;
  diff?: LogDiff;
  note?: string;
  team?: Team;
  contentMaster?: ContentMaster;
  individual?: Individual;
};
