import { TenantScopedEntity } from '../..';

import { Entity, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Countries } from '@okampus/shared/consts';

import type { Upload } from '../../upload/upload';
import type { Actor } from '../actor.entity';
import type { ActorAddressOptions } from './actor-address.options';

@Entity()
export class ActorAddress extends TenantScopedEntity {
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

  @OneToOne({ type: 'Upload', nullable: true, default: null })
  image: Upload | null = null;

  @Property({ type: 'boolean' })
  public = false;

  constructor(options: ActorAddressOptions) {
    super(options);
    this.assign(options);
  }
}
