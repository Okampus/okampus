import { BankInfoRepository } from './bank-info.repository';
import { TenantScopableEntity } from '../../tenant-scoped.entity';
import { Address } from '../address/address.entity';
import { Actor } from '../actor.entity';
import { LegalUnit } from '../legal-unit/legal-unit.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { BankInfoOptions } from './bank-info.options';

@Entity({ customRepository: () => BankInfoRepository })
export class BankInfo extends TenantScopableEntity {
  [EntityRepositoryType]!: BankInfoRepository;

  @Property({ type: 'text' })
  bicSwift!: string;

  @Property({ type: 'text', default: '' })
  holderName = '';

  @Property({ type: 'text' })
  iban!: string;

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'LegalUnit' })
  bank!: LegalUnit;

  @ManyToOne({ type: 'Address' })
  branchAddress!: Address;

  constructor(options: BankInfoOptions) {
    super(options);
    this.assign(options);
  }
}
