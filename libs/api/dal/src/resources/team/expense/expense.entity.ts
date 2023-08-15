import { ExpenseRepository } from './expense.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { ApprovalState } from '@okampus/shared/enums';

import type { Bank } from '../../actor/bank/bank.entity';
import type { ExpenseItem } from '../expense-item/expense-item.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Finance } from '../finance/finance.entity';
import type { ExpenseOptions } from './expense.options';
import type { Individual } from '../../individual/individual.entity';

@Entity({ customRepository: () => ExpenseRepository })
export class Expense extends TenantScopedEntity {
  [EntityRepositoryType]!: ExpenseRepository;

  @Property({ type: 'text' })
  description!: string;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @Property({ type: 'datetime', nullable: true, default: null })
  lastNotifiedAt: Date | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  processedBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  processedAt: Date | null = null;

  @OneToOne({ type: 'Finance', mappedBy: 'expense' })
  finance?: Finance;

  @ManyToOne({ type: 'FileUpload' })
  expenseReport!: FileUpload;

  @ManyToOne({ type: 'Bank' })
  bank!: Bank;

  @OneToMany({ type: 'ExpenseItem', mappedBy: 'expense' })
  @TransformCollection()
  expenseItems = new Collection<ExpenseItem>(this);

  constructor(options: ExpenseOptions) {
    super(options);
    this.assign(options);
  }
}
