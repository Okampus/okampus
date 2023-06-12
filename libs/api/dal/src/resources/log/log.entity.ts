import { LogRepository } from './log.repository';
import { TenantScopedEntity } from '..';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property, t } from '@mikro-orm/core';
import { EntityName, EventContext, EventType } from '@okampus/shared/enums';

import type { LogOptions } from './log.options';
import type { Team } from '../team/team.entity';
import type { ContentMaster } from '../content-master/content-master.entity';
import type { LogDiff } from '@okampus/shared/types';
import type { Individual } from '../individual/individual.entity';

@Entity({ customRepository: () => LogRepository })
export class Log extends TenantScopedEntity {
  [EntityRepositoryType]!: LogRepository;

  @Enum({ items: () => EventType, type: EnumType })
  event!: EventType;

  @Enum({ items: () => EventContext, type: EnumType })
  context!: EventContext;

  @Property({ type: 'json', default: '{}' })
  diff: LogDiff = {};

  @Enum({ items: () => EntityName, type: EnumType })
  entityName!: EntityName;

  @Property({ type: t.bigint })
  entityId!: string;

  @Property({ type: 'text', default: '' })
  note = '';

  @ManyToOne({ type: 'Team', nullable: true, default: null })
  team: Team | null = null;

  @ManyToOne({ type: 'ContentMaster', nullable: true, default: null })
  contentMaster: ContentMaster | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  individual: Individual | null = null;

  constructor(options: LogOptions) {
    super(options);
    this.assign(options);
  }
}
