import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Collection, Entity, Enum, EnumType, ManyToOne, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { ApprovalState } from '@okampus/shared/enums';

import type { ActorBankInfo } from '../../actor/actor-bank-info/actor-bank-info.entity';
import type { ExpenseItem } from '../expense-item/expense-item.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Finance } from '../finance/finance.entity';
import type { ExpenseOptions } from './expense.options';
import type { Individual } from '../../individual/individual.entity';

@Entity()
export class Expense extends TenantScopedEntity {
  @Property({ type: 'text' })
  description!: string;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @Property({ type: 'Date', nullable: true, default: null })
  lastNotifiedAt: Date | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  settledBy: Individual | null = null;

  @Property({ type: 'Date', nullable: true, default: null })
  settledAt: Date | null = null;

  @OneToOne({ type: 'Finance', mappedBy: 'expense' })
  finance!: Finance;

  @ManyToOne({ type: 'FileUpload' })
  expenseReport!: FileUpload;

  @ManyToOne({ type: 'ActorBankInfo' })
  bankInfo!: ActorBankInfo;

  @OneToMany({ type: 'ExpenseItem', mappedBy: 'expense' })
  @TransformCollection()
  expenseItems = new Collection<ExpenseItem>(this);

  constructor(options: ExpenseOptions) {
    super(options);
    this.assign(options);
  }
}
