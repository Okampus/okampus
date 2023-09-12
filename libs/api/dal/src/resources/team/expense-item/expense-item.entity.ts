import { ExpenseItemRepository } from './expense-item.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { TransactionCategory } from '@okampus/shared/enums';

import type { ExpenseItemOptions } from './expense-item.options';
import type { Expense } from '../expense/expense.entity';
import type { LegalUnit } from '../../actor/legal-unit/legal-unit.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

@Entity({ customRepository: () => ExpenseItemRepository })
export class ExpenseItem extends TenantScopedEntity {
  [EntityRepositoryType]!: ExpenseItemRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'float' })
  unitCost!: number;

  @Property({ type: 'smallint' })
  quantity!: number;

  @Enum({ items: () => TransactionCategory, type: EnumType, default: TransactionCategory.Other })
  category = TransactionCategory.Other;

  @Property({ type: 'datetime', nullable: true, default: null })
  payedAt: Date | null = null;

  @ManyToOne({ type: 'LegalUnit', nullable: true, default: null })
  company: LegalUnit | null = null;

  @ManyToOne({ type: 'Expense', nullable: true, default: null })
  expense: Expense | null = null;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  constructor(options: ExpenseItemOptions) {
    super(options);
    this.assign(options);
  }
}
