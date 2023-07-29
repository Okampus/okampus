import { ReportRepository } from './report.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { ReportReason } from '@okampus/shared/enums';

import type { Actor } from '../../actor/actor.entity';
import type { Content } from '../content.entity';
import type { ReportOptions } from './report.options';

@Entity({ customRepository: () => ReportRepository })
export class Report extends TenantScopedEntity {
  [EntityRepositoryType]!: ReportRepository;

  @Enum({ items: () => ReportReason, type: EnumType })
  type!: ReportReason;

  @Property({ type: 'text', default: '' })
  reason = '';

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  actor: Actor | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: ReportOptions) {
    super(options);
    this.assign(options);
  }
}
