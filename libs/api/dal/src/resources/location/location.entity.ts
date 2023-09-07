import { LocationRepository } from './location.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';

import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { LocationType } from '@okampus/shared/enums';

import type { LocationOptions } from './location.options';
import type { Actor } from '../actor/actor.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Address } from '../actor/address/address.entity';

@Entity({ customRepository: () => LocationRepository })
export class Location extends TenantScopedEntity {
  [EntityRepositoryType]!: LocationRepository;

  @Enum({ items: () => LocationType, type: EnumType })
  type!: LocationType;

  @Property({ type: 'text', default: '' })
  name = '';

  @Property({ type: 'text', default: '' })
  link = '';

  @Property({ type: 'text', default: '' })
  details = '';

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'Address', nullable: true, default: null })
  address: Address | null = null;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  images = new Collection<FileUpload>(this);

  constructor(options: LocationOptions) {
    super(options);
    this.assign(options);
  }
}
