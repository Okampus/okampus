import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import type { VoteOptions } from './vote.options';
import type { Content } from '../content.entity';

@Entity()
@WithActive()
export class Vote extends TenantScopedEntity {
  @Property({ type: 'smallint' })
  value!: -1 | 0 | 1;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: VoteOptions) {
    super(options);
    this.assign(options);
  }
}
