import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Collection, Entity, Enum, EnumType, ManyToMany, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import { FinanceCategory } from '@okampus/shared/enums';

import type { TeamFinance } from '../../team/team-finance/team-finance.entity';
import type { Expense } from '../../team/expense/expense.entity';
import type { Actor } from '../actor.entity';
import type { ActorAddress } from '../actor-address/actor-address.entity';
import type { Upload } from '../../upload/upload';
import type { ActorFinanceOptions } from './actor-finance.options';

@Entity()
export class ActorFinance extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  description = '';

  @Property({ type: 'float' })
  amount!: number;

  @ManyToOne({ type: 'ActorAddress' })
  location: ActorAddress | null = null;

  @Enum({ items: () => FinanceCategory, type: EnumType })
  category!: FinanceCategory;

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  payedBy: Actor | null = null;

  @Property({ type: 'datetime' })
  payedAt!: Date;

  @ManyToOne({ type: 'Expense', nullable: true })
  expense: Expense | null = null;

  @OneToOne({ type: 'TeamFinance', mappedBy: 'actorFinance', nullable: true })
  finance: TeamFinance | null = null;

  @ManyToMany({ type: 'Upload' })
  @TransformCollection()
  receipts = new Collection<Upload>(this);

  constructor(options: ActorFinanceOptions) {
    super(options);
    this.assign(options);
  }
}
