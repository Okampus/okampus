import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, Index, ManyToOne, Property } from '@mikro-orm/core';
import { ReactionType } from '@okampus/shared/enums';

import type { ReportOptions } from '../report/report.options';
import type { Content } from '../content.entity';

@Entity()
@WithActive()
export class Reaction extends TenantScopedEntity {
  @Index()
  @Enum({ items: () => ReactionType, type: EnumType })
  reactionType!: ReactionType;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: ReportOptions) {
    super(options);
    this.assign(options);
  }
}
