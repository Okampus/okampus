import { BankInfoRepository } from './bank-info.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Address } from '../address/address.entity';
import { Actor } from '../actor.entity';
import { LegalUnit } from '../legal-unit/legal-unit.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { BankInfoOptions } from './bank-info.options';

@Entity({ customRepository: () => BankInfoRepository })
export class BankInfo extends TenantScopedEntity {
  [EntityRepositoryType]!: BankInfoRepository;

  // TODO: add holder address?

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'LegalUnit' })
  bank!: LegalUnit;

  @ManyToOne({ type: 'Address' })
  branchAddress!: Address;

  @Property({ type: 'text' })
  bicSwift!: string;

  @Property({ type: 'text', default: '' })
  holderName = '';

  @Property({ type: 'text' })
  iban!: string;

  constructor(options: BankInfoOptions) {
    super(options);
    this.assign(options);
  }
}
