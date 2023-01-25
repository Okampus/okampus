import { Entity, EntityRepositoryType, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { ActorImageType } from '@okampus/shared/enums';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Actor } from '../../actor/actor.entity';
import { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import { ActorImageOptions } from './actor-image.options';
// eslint-disable-next-line import/no-cycle
import { ActorImageRepository } from './actor-image.repository';

@Entity({ customRepository: () => ActorImageRepository })
export class ActorImage extends TenantScopedEntity {
  [EntityRepositoryType]!: ActorImageRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @OneToOne({ type: 'ImageUpload', onDelete: 'CASCADE' })
  image!: ImageUpload;

  @Enum(() => ActorImageType)
  type!: ActorImageType;

  @Property({ type: 'datetime', nullable: true })
  lastActiveDate: Date | null = null;

  constructor(options: ActorImageOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
