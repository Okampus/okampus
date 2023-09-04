import { ActorTagRepository } from './actor-tag.repository';
import { TenantScopedEntity } from '../..';
import { WithActive } from '../../../shards/filters/with-active';

import { Entity, EntityRepositoryType, ManyToOne, OneToOne } from '@mikro-orm/core';

import type { ActorTagOptions } from './actor-tag.options';
import type { Actor } from '../actor.entity';
import type { Tag } from '../../tag/tag.entity';

@Entity({ customRepository: () => ActorTagRepository })
@WithActive()
export class ActorTag extends TenantScopedEntity {
  [EntityRepositoryType]!: ActorTagRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @OneToOne({ type: 'Tag', onDelete: 'CASCADE' })
  tag!: Tag;

  constructor(options: ActorTagOptions) {
    super(options);
    this.assign(options);
  }
}
