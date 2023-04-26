import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { ReportReason } from '@okampus/shared/enums';

import type { Actor } from '../../actor/actor.entity';
import type { ReportOptions } from './report.options';
import type { Content } from '../content.entity';

@Entity()
export class Report extends TenantScopedEntity {
  @Enum({ items: () => ReportReason, type: EnumType })
  type!: ReportReason;

  @Property({ type: 'text', nullable: true, default: null })
  reason: string | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  actor: Actor | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: ReportOptions) {
    super(options);
    this.assign(options);
  }
}
