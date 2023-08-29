import { BankAccountRepository } from './bank-account.repository';
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
import { BankAccountType } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';

import type { BankAccountOptions } from './bank-account.options';
import type { Team } from '../team.entity';
import type { BankInfo } from '../../actor/bank-info/bank-info.entity';

@Entity({ customRepository: () => BankAccountRepository })
export class BankAccount extends TenantScopedEntity {
  [EntityRepositoryType]!: BankAccountRepository;

  @Enum({ items: () => BankAccountType, type: EnumType, default: BankAccountType.Primary })
  type = BankAccountType.Primary;

  @Property({ type: 'text' })
  name!: string;

  @ManyToOne({ type: 'BankAccount', nullable: true, default: null })
  parent: BankAccount | null = null;

  @ManyToOne({ type: 'BankInfo', nullable: true })
  bankInfo: BankInfo | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @OneToMany({ type: 'BankAccount', mappedBy: 'parent' })
  @TransformCollection()
  children = new Collection<BankAccount>(this);

  constructor(options: BankAccountOptions) {
    super(options);
    this.assign(options);
  }
}
