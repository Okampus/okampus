import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Collection, Entity, Enum, EnumType, ManyToOne, OneToMany, OneToOne, Property } from '@mikro-orm/core';
import { ExpenseState } from '@okampus/shared/enums';

import type { Issue } from '../../content-master/issue/issue.entity';
import type { ActorBankInfo } from '../../actor/actor-bank-info/actor-bank-info.entity';
import type { ActorFinance } from '../../actor/actor-finance/actor-finance.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { TeamFinance } from '../team-finance/team-finance.entity';
import type { ExpenseOptions } from './expense.options';

@Entity()
export class Expense extends TenantScopedEntity {
  @OneToOne({ type: 'TeamFinance', mappedBy: 'expense' })
  finance!: TeamFinance;

  @ManyToOne({ type: 'Issue', nullable: true, default: null })
  issue!: Issue;

  @ManyToOne({ type: 'FileUpload' })
  expenseReport!: FileUpload;

  @ManyToOne({ type: 'ActorBankInfo' })
  bankInfo!: ActorBankInfo;

  @Enum({ items: () => ExpenseState, type: EnumType })
  state!: ExpenseState;

  @Property({ type: 'text' })
  description!: string;

  @OneToMany({ type: 'ActorFinance', mappedBy: 'expense' })
  actorFinances = new Collection<ActorFinance>(this);

  constructor(options: ExpenseOptions) {
    super(options);
    this.assign(options);
  }
}
