import { BankInfoRepository } from './bank-info.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { Countries } from '@okampus/shared/consts';

import type { LegalUnitLocation } from '../legal-unit-location/legal-unit-location.entity';
import type { BankInfoOptions } from './bank-info.options';
import type { Actor } from '../actor.entity';

@Entity({ customRepository: () => BankInfoRepository })
export class BankInfo extends TenantScopedEntity {
  [EntityRepositoryType]!: BankInfoRepository;

  // TODO: add holder address?

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'LegalUnitLocation', nullable: true, default: null })
  bank: LegalUnitLocation | null = null;

  @Property({ type: 'text', default: '' })
  holderName = '';

  @Property({ type: 'text' })
  bicSwift!: string;

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
