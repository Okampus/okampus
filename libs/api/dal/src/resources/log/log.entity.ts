import { LogRepository } from './log.repository';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, PrimaryKey, Property, t } from '@mikro-orm/core';

import { EntityName, EventContext, EventType } from '@okampus/shared/enums';
import { isIn } from '@okampus/shared/utils';

import type { LogOptions } from './log.options';

import type { Tenant } from '..';
import type { Team } from '../team/team.entity';
import type { Event } from '../event/event.entity';
import type { User } from '../user/user.entity';

import type { LogDiff } from '@okampus/shared/types';

@Entity({ customRepository: () => LogRepository })
export class Log {
  [EntityRepositoryType]!: LogRepository;

  @PrimaryKey({ type: t.bigint, defaultRaw: '"public"."snowflake"()', autoincrement: false })
  id!: string;

  @Property({ type: 'datetime', defaultRaw: 'current_timestamp' })
  createdAt!: Date;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  createdBy: User | null = null; // null for system

  @Enum({ items: () => EventType, type: EnumType })
  eventType!: EventType;

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

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  event: Event | null = null;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  user: User | null = null;

  @ManyToOne({ type: 'Tenant', nullable: true, default: null })
  tenant: Tenant | null = null;

  protected assign<T extends object>(options: T): void {
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && isIn(key, this)) this[key] = value;
    }
  }

  constructor(options: LogOptions) {
    this.assign(options);
  }
}
