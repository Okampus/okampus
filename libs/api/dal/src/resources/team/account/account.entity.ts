import { AccountRepository } from './account.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, ManyToOne, EntityRepositoryType, Enum, EnumType } from '@mikro-orm/core';
import { AccountType } from '@okampus/shared/enums';

import type { AccountOptions } from './account.options';
import type { Team } from '../team.entity';
import type { BankInfo } from '../../actor/bank-info/bank-info.entity';

@Entity({ customRepository: () => AccountRepository })
export class Account extends TenantScopedEntity {
  [EntityRepositoryType]!: AccountRepository;

  @Enum({ items: () => AccountType, type: EnumType, default: AccountType.Primary })
  type = AccountType.Primary;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'float', default: 0 })
  balance = 0;

  @ManyToOne({ type: 'BankInfo', nullable: true })
  bankInfo: BankInfo | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  constructor(options: AccountOptions) {
    super(options);
    this.assign(options);
  }
}
