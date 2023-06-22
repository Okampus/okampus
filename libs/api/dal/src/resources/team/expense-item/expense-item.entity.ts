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
import { FinanceCategory } from '@okampus/shared/enums';

import type { Expense } from '../expense/expense.entity';
import type { Address } from '../../actor/address/address.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { ExpenseItemOptions } from './expense-item.options';

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

  @Enum({ items: () => FinanceCategory, type: EnumType, default: FinanceCategory.Unknown })
  category = FinanceCategory.Unknown;

  @Property({ type: 'datetime', nullable: true, default: null })
  payedAt: Date | null = null;

  @ManyToOne({ type: 'Address', nullable: true, default: null })
  address: Address | null = null;

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
