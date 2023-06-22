import { FinanceRepository } from './finance.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToMany,
  ManyToOne,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { PaymentMethod, FinanceState, PayedByType, FinanceCategory, AddressType } from '@okampus/shared/enums';

import type { Team } from '../team.entity';
import type { Address } from '../../actor/address/address.entity';
import type { FinanceOptions } from './finance.options';
import type { Expense } from '../expense/expense.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { FileUpload } from 'graphql-upload-minimal';
import type { Actor } from '../../actor/actor.entity';

@Entity({ customRepository: () => FinanceRepository })
export class Finance extends TenantScopedEntity {
  [EntityRepositoryType]!: FinanceRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'float' })
  amount!: number;

  @Enum({ items: () => PaymentMethod, type: EnumType })
  method!: PaymentMethod;

  @Enum({ items: () => FinanceState, default: FinanceState.Completed, type: EnumType })
  state = FinanceState.Completed;

  @Enum({ items: () => FinanceCategory, type: EnumType })
  category!: FinanceCategory;

  @Enum({ items: () => PayedByType, default: PayedByType.Manual, type: EnumType })
  payedByType: PayedByType = PayedByType.Manual;

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  payedBy: Actor | null = null;

  @Property({ type: 'datetime' })
  payedAt!: Date;

  @ManyToOne({ type: 'Actor' })
  receivedBy!: Actor;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'Address', nullable: true, default: null })
  address: Address | null = null;

  @Enum({ items: () => AddressType, default: AddressType.Known, type: EnumType })
  addressType: AddressType = AddressType.Known;

  @OneToOne({ type: 'Expense', inversedBy: 'finance', nullable: true, default: null })
  expense: Expense | null = null;

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  event: Event | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  constructor(options: FinanceOptions) {
    super(options);
    this.assign(options);
  }
}
