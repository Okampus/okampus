import { LocationRepository } from './location.repository';

import { TenantScopedEntity } from '../../tenant-scoped.entity';
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

import type { Actor } from '../actor.entity';
import type { Address } from '../address/address.entity';
import type { LocationOptions } from './location.options';
import type { FileUpload } from 'graphql-upload-minimal';

@Entity({ customRepository: () => LocationRepository })
export class Location extends TenantScopedEntity {
  [EntityRepositoryType]!: LocationRepository;

  @Enum({ items: () => LocationType, type: EnumType })
  type!: LocationType;

  @Property({ type: 'text', default: '' })
  onlineLink = '';

  @Property({ type: 'text', default: '' })
  locationNote = '';

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  images = new Collection<FileUpload>(this);

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'Address', nullable: true, default: null })
  address: Address | null = null;

  constructor(options: LocationOptions) {
    super(options);
    this.assign(options);
  }
}
