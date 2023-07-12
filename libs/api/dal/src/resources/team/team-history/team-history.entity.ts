import { TeamHistoryRepository } from './team-history.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';

import { ApproximateDate, TeamHistoryEventType } from '@okampus/shared/enums';

import type { Team } from '../team.entity';
import type { TeamHistoryOptions } from './team-history.options';

@Entity({ customRepository: () => TeamHistoryRepository })
export class TeamHistory extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamHistoryRepository;

  @Enum({ items: () => ApproximateDate, type: EnumType })
  approximateDate!: ApproximateDate;

  @Property({ type: 'datetime' })
  eventDate!: Date;

  @Enum({ items: () => TeamHistoryEventType, type: EnumType })
  eventType!: TeamHistoryEventType;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  constructor(options: TeamHistoryOptions) {
    super(options);
    this.assign(options);
  }
}
