import { FollowRepository } from './follow.repository';
import { TenantScopedEntity } from '../..';
import { Entity, EntityRepositoryType, ManyToOne } from '@mikro-orm/core';

import type { Actor } from '../../actor/actor.entity';
import type { FollowOptions } from './follow.options';

@Entity({ customRepository: () => FollowRepository })
export class Follow extends TenantScopedEntity {
  [EntityRepositoryType]!: FollowRepository;

  @ManyToOne({ type: 'Actor' })
  followedActor!: Actor;

  constructor(options: FollowOptions) {
    super(options);
    this.assign(options);
  }
}
