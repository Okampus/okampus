import { TeamFinanceRepository } from './team-finance.repository';
import { TenantScopedEntity } from '../..';
import { ActorFinance } from '../../actor/actor-finance/actor-finance.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne } from '@mikro-orm/core';
import { PaymentMethod, FinanceState, PayedByType } from '@okampus/shared/enums';

import type { TeamFinanceOptions } from './team-finance.options';
import type { Expense } from '../expense/expense.entity';
import type { Team } from '../team.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';

@Entity({ customRepository: () => TeamFinanceRepository })
export class TeamFinance extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamFinanceRepository;

  @Enum({ items: () => PaymentMethod, type: EnumType })
  method!: PaymentMethod;

  @Enum({ items: () => FinanceState, type: EnumType })
  state!: FinanceState;

  @Enum({ items: () => PayedByType, default: PayedByType.Manual, type: EnumType })
  payedByType: PayedByType = PayedByType.Manual;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @OneToOne({ type: 'Expense', inversedBy: 'finance', nullable: true })
  expense: Expense | null = null;

  @OneToOne({ type: 'ActorFinance', inversedBy: 'finance', nullable: true })
  actorFinance: ActorFinance | null = null;

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  event: Event | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  constructor(options: TeamFinanceOptions) {
    super(options);
    this.assign(options);

    this.actorFinance = new ActorFinance(options);
  }
}
