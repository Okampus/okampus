import { EventFavoriteRepository } from './event-favorite.repository';
import { WithActive } from '../../../shards/filters/with-active';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { Event } from '../event.entity';
import type { EventFavoriteOptions } from './event-favorite.options';

@Entity({ customRepository: () => EventFavoriteRepository })
@WithActive()
export class EventFavorite extends TenantScopedEntity {
  [EntityRepositoryType]!: EventFavoriteRepository;

  @ManyToOne({ type: 'Event' })
  event!: Event;

  constructor(options: EventFavoriteOptions) {
    super(options);
    this.assign(options);
  }
}
