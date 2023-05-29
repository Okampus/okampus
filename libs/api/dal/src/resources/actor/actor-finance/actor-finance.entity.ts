import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { FinanceCategory } from '@okampus/shared/enums';

import type { Expense } from '../../team/expense/expense.entity';
import type { Actor } from '../actor.entity';
import type { ActorAddress } from '../actor-address/actor-address.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { ActorFinanceOptions } from './actor-finance.options';

@Entity()
export class ActorFinance extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'float' })
  amount!: number;

  @Enum({ items: () => FinanceCategory, type: EnumType })
  category!: FinanceCategory;

  @Property({ type: 'datetime' })
  payedAt!: Date;

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  payedBy: Actor | null = null;

  @ManyToOne({ type: 'ActorAddress', nullable: true, default: null })
  address: ActorAddress | null = null;

  @ManyToOne({ type: 'Expense', nullable: true })
  expense: Expense | null = null;

  @ManyToOne({ type: 'FileUpload' })
  receipt: FileUpload | null = null;

  constructor(options: ActorFinanceOptions) {
    super(options);
    this.assign(options);
  }
}
