import { AddressRepository } from './address.repository';

import { BaseEntity } from '../../base.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, Property } from '@mikro-orm/core';
import { Countries } from '@okampus/shared/consts';

import type { AddressOptions } from './address.options';

@Entity({ customRepository: () => AddressRepository })
export class Address extends BaseEntity {
  [EntityRepositoryType]!: AddressRepository;

  @Property({ type: 'float', nullable: true, default: null })
  latitude: number | null = null;

  @Property({ type: 'float', nullable: true, default: null })
  longitude: number | null = null;

  @Property({ type: 'text', default: '' })
  category = '';

  @Property({ type: 'text', default: '' })
  name = '';

  @Property({ type: 'text' })
  streetNumber!: string;

  @Property({ type: 'text' })
  street!: string;

  @Property({ type: 'text' })
  zip!: string;

  @Property({ type: 'text' })
  city!: string;

  @Property({ type: 'text', default: '' })
  state = '';

  @Enum({ items: () => Countries, default: Countries.France, type: EnumType })
  country: Countries = Countries.France;

  @Property({ type: 'text', nullable: true, default: null })
  geoapifyId: string | null = null;

  constructor(options: AddressOptions) {
    super();
    this.assign(options);
  }
}
