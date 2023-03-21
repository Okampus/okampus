import { ActorImageRepository } from './actor-image.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { WithActive } from '../../../shards/filters/with-active';

import { Entity, EntityRepositoryType, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { ActorImageType } from '@okampus/shared/enums';

import type { Actor } from '../../actor/actor.entity';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { ActorImageOptions } from './actor-image.options';

@Entity({ customRepository: () => ActorImageRepository })
@WithActive()
export class ActorImage extends TenantScopedEntity {
  [EntityRepositoryType]!: ActorImageRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @OneToOne({ type: 'ImageUpload', onDelete: 'CASCADE' })
  image!: ImageUpload;

  @Enum({ items: () => ActorImageType, type: 'string' })
  type!: ActorImageType;

  @Property({ type: 'datetime', nullable: true })
  lastActiveDate: Date | null = null;

  constructor(options: ActorImageOptions) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
