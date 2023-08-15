import { BankRepository } from './bank.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';

import type { LegalUnitLocation } from '../legal-unit-location/legal-unit-location.entity';
import type { BankOptions } from './bank.options';
import type { Actor } from '../actor.entity';

@Entity({ customRepository: () => BankRepository })
export class Bank extends TenantScopedEntity {
  [EntityRepositoryType]!: BankRepository;

  // TODO: add holder address?

  @ManyToOne({ type: 'Actor' })
  actor!: Actor;

  @ManyToOne({ type: 'LegalUnitLocation', nullable: true, default: null })
  legalUnitLocation: LegalUnitLocation | null = null;

  @Property({ type: 'text' })
  bicSwift!: string;

  @Property({ type: 'text', default: '' })
  holderName = '';

  @Property({ type: 'text' })
  iban!: string;

  constructor(options: BankOptions) {
    super(options);
    this.assign(options);
  }
}
