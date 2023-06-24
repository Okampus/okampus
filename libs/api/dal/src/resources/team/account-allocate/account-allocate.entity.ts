import { AccountAllocateRepository } from './account-allocate.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, ManyToOne, EntityRepositoryType } from '@mikro-orm/core';

import type { AccountAllocateOptions } from './account-allocate.options';
import type { Team } from '../team.entity';
import type { Account } from '../account/account.entity';

@Entity({ customRepository: () => AccountAllocateRepository })
export class AccountAllocate extends TenantScopedEntity {
  [EntityRepositoryType]!: AccountAllocateRepository;

  @Property({ type: 'float', default: 0 })
  balance = 0;

  @ManyToOne({ type: 'Account' })
  account!: Account;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  constructor(options: AccountAllocateOptions) {
    super(options);
    this.assign(options);
  }
}
