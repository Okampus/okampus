import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { Countries } from '@okampus/shared/consts';

import type { Actor } from '../actor.entity';
import type { ActorAddress } from '../actor-address/actor-address.entity';
import type { ActorBankInfoOptions } from './actor-bank-info.options';

@Entity()
export class ActorBankInfo extends TenantScopedEntity {
  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'ActorAddress' })
  address!: ActorAddress;

  @Property({ type: 'text' })
  holderName!: string;

  @Property({ type: 'text' })
  bankCodeBic!: string;

  @Property({ type: 'text' })
  fullAcount!: string;

  @Enum({ items: () => Countries, type: EnumType })
  country: Countries = Countries.France;

  @Property({ type: 'text' })
  countryCode!: string;

  @Property({ type: 'text' })
  bankCode!: string;

  @Property({ type: 'text' })
  agencyCode!: string;

  @Property({ type: 'text' })
  accountCode!: string;

  @Property({ type: 'text' })
  checksum!: string;

  constructor(options: ActorBankInfoOptions) {
    super(options);
    this.assign(options);
  }
}
