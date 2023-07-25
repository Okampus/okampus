import { ViewRepository } from './view.repository';
import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { ViewOptions } from './view.options';
import type { Content } from '../content.entity';

@Entity({ customRepository: () => ViewRepository })
@WithActive()
export class View extends TenantScopedEntity {
  [EntityRepositoryType]!: ViewRepository;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: ViewOptions) {
    super(options);
    this.assign(options);
  }
}
