import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import type { Actor } from '../../actor/actor.entity';

import type { FavoriteOptions } from './favorite.options';
import type { Content } from '../content.entity';

@Entity()
@WithActive()
export class Favorite extends TenantScopedEntity {
  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  @ManyToOne({ type: 'Content', nullable: true, default: null })
  content: Content | null = null;

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  actor: Actor | null = null;

  constructor(options: FavoriteOptions) {
    super(options);
    this.assign(options);
  }
}
