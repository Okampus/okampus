import { AddressRepository } from './address.repository';
import { TenantScopedEntity } from '../..';

import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Countries } from '@okampus/shared/consts';

import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Actor } from '../actor.entity';
import type { AddressOptions } from './address.options';
import type { Campus } from '../../tenant/campus/campus.entity';

@Entity({ customRepository: () => AddressRepository })
export class Address extends TenantScopedEntity {
  [EntityRepositoryType]!: AddressRepository;

  @ManyToOne({ type: 'Actor', onDelete: 'CASCADE' })
  actor!: Actor;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'float', nullable: true, default: null })
  latitude: number | null = null;

  @Property({ type: 'float', nullable: true, default: null })
  longitude: number | null = null;

  @Property({ type: 'text' })
  street!: string;

  @Property({ type: 'text' })
  city!: string;

  @Property({ type: 'text' })
  zip!: string;

  @Property({ type: 'text' })
  state!: string;

  @Enum({ items: () => Countries, default: Countries.France, type: EnumType })
  country: Countries = Countries.France;

  @OneToOne({ type: 'FileUpload', nullable: true, default: null })
  image: FileUpload | null = null;

  @OneToOne({ type: 'Campus', inversedBy: 'address', nullable: true, default: null })
  campus: Campus | null = null;

  @Property({ type: 'boolean' })
  public = false;

  constructor(options: AddressOptions) {
    super(options);
    this.assign(options);
  }
}
