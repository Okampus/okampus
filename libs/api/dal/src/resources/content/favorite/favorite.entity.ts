import { FavoriteRepository } from './favorite.repository';
import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { FavoriteOptions } from './favorite.options';
import type { Content } from '../content.entity';

@Entity({ customRepository: () => FavoriteRepository })
@WithActive()
export class Favorite extends TenantScopedEntity {
  [EntityRepositoryType]!: FavoriteRepository;

  @ManyToOne({ type: 'Content' })
  content!: Content;

  constructor(options: FavoriteOptions) {
    super(options);
    this.assign(options);
  }
}
