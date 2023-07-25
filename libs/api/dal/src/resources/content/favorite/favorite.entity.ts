import { FavoriteRepository } from './favorite.repository';
import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { FavoriteOptions } from './favorite.options';
import type { Content } from '../content.entity';

@Entity({ customRepository: () => FavoriteRepository })
@WithActive()
export class Favorite extends TenantScopedEntity {
  [EntityRepositoryType]!: FavoriteRepository;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  constructor(options: FavoriteOptions) {
    super(options);
    this.assign(options);
  }
}
