import { BankInfoRepository } from './bank-info.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { Countries } from '@okampus/shared/consts';

import type { Actor } from '../actor.entity';
import type { Address } from '../address/address.entity';
import type { BankInfoOptions } from './bank-info.options';

@Entity({ customRepository: () => BankInfoRepository })
export class BankInfo extends TenantScopedEntity {
  [EntityRepositoryType]!: BankInfoRepository;

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'Address' })
  address!: Address;

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

  constructor(options: BankInfoOptions) {
    super(options);
    this.assign(options);
  }
}