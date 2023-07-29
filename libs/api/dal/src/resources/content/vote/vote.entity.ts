import { VoteRepository } from './vote.repository';
import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { VoteOptions } from './vote.options';
import type { Content } from '../content.entity';

@Entity({ customRepository: () => VoteRepository })
@WithActive()
export class Vote extends TenantScopedEntity {
  [EntityRepositoryType]!: VoteRepository;

  @Property({ type: 'smallint' })
  value!: -1 | 0 | 1;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: VoteOptions) {
    super(options);
    this.assign(options);
  }
}
