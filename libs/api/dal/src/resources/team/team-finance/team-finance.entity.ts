import { TeamFinanceRepository } from './team-finance.repository';
import { TenantScopedEntity } from '../..';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { PaymentMethod, FinanceState, PayedByType, FinanceCategory, AddressType } from '@okampus/shared/enums';
import type { Team } from '../team.entity';

import type { ActorAddress } from '../../actor/actor-address/actor-address.entity';
import type { TeamFinanceOptions } from './team-finance.options';
import type { Expense } from '../expense/expense.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { FileUpload } from 'graphql-upload-minimal';
import type { Actor } from '../../actor/actor.entity';

@Entity({ customRepository: () => TeamFinanceRepository })
export class TeamFinance extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamFinanceRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'float' })
  amount!: number;

  @Enum({ items: () => PaymentMethod, type: EnumType })
  method!: PaymentMethod;

  @Enum({ items: () => FinanceState, default: FinanceState.Completed, type: EnumType })
  state!: FinanceState;

  @Enum({ items: () => FinanceCategory, type: EnumType })
  category!: FinanceCategory;

  @Property({ type: 'datetime' })
  payedAt!: Date;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @Enum({ items: () => PayedByType, default: PayedByType.Manual, type: EnumType })
  payedByType: PayedByType = PayedByType.Manual;

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  payedBy: Actor | null = null;

  @Enum({ items: () => AddressType, default: AddressType.Known, type: EnumType })
  addressType: AddressType = AddressType.Known;

  @ManyToOne({ type: 'ActorAddress', nullable: true, default: null })
  address: ActorAddress | null = null;

  @OneToOne({ type: 'Expense', inversedBy: 'finance', nullable: true })
  expense: Expense | null = null;

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  event: Event | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  receipt: FileUpload | null = null;

  constructor(options: TeamFinanceOptions) {
    super(options);
    this.assign(options);
  }
}
