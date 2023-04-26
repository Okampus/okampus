import { TenantScopedEntity } from '../..';
import { WithActive } from '../../../shards/filters/with-active';

import { Entity, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { ActorImageType } from '@okampus/shared/enums';

import type { Upload } from '../../upload/upload';
import type { Actor } from '../../actor/actor.entity';
import type { ActorImageOptions } from './actor-image.options';

@Entity()
@WithActive()
export class ActorImage extends TenantScopedEntity {
  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @OneToOne({ type: 'Upload', onDelete: 'CASCADE' })
  image!: Upload;

  @Enum({ items: () => ActorImageType, type: EnumType })
  type!: ActorImageType;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  constructor(options: ActorImageOptions) {
    super(options);
    this.assign(options);
  }
}