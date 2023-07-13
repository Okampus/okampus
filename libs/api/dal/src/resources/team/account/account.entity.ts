import { AccountRepository } from './account.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Entity,
  Property,
  ManyToOne,
  EntityRepositoryType,
  Enum,
  EnumType,
  Collection,
  OneToMany,
} from '@mikro-orm/core';
import { AccountType } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';

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

  @ManyToOne({ type: 'Account', nullable: true, default: null })
  parent: Account | null = null;

  @ManyToOne({ type: 'BankInfo', nullable: true })
  bankInfo: BankInfo | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @OneToMany({ type: 'Account', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<Account>(this);

  constructor(options: AccountOptions) {
    super(options);
    this.assign(options);
  }
}
