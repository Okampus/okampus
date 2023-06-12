import { ActorImageRepository } from './actor-image.repository';
import { TenantScopedEntity } from '../..';
import { WithActive } from '../../../shards/filters/with-active';

import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { ActorImageType } from '@okampus/shared/enums';

import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Actor } from '../../actor/actor.entity';
import type { ActorImageOptions } from './actor-image.options';

@Entity({ customRepository: () => ActorImageRepository })
@WithActive()
export class ActorImage extends TenantScopedEntity {
  [EntityRepositoryType]!: ActorImageRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @OneToOne({ type: 'FileUpload', onDelete: 'CASCADE' })
  image!: FileUpload;

  @Enum({ items: () => ActorImageType, type: EnumType })
  type!: ActorImageType;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastActiveDate: Date | null = null;

  constructor(options: ActorImageOptions) {
    super(options);
    this.assign(options);
  }
}
