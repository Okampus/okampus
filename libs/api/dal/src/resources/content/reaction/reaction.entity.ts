import { ReactionRepository } from './reaction.repository';
import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, Index, ManyToOne } from '@mikro-orm/core';
import { ReactionType } from '@okampus/shared/enums';

import type { Content } from '../content.entity';
import type { ReportOptions } from '../report/report.options';

@Entity({ customRepository: () => ReactionRepository })
@WithActive()
export class Reaction extends TenantScopedEntity {
  [EntityRepositoryType]!: ReactionRepository;

  @Index()
  @Enum({ items: () => ReactionType, type: EnumType })
  reactionType!: ReactionType;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: ReportOptions) {
    super(options);
    this.assign(options);
  }
}
