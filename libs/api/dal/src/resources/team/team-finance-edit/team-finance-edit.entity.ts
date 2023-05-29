import { TeamFinanceEditRepository } from './team-finance-edit.repository';
import { TenantScopedEntity } from '../..';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { PaymentMethod, FinanceState, PayedByType } from '@okampus/shared/enums';

import type { ActorAddress } from '../../actor/actor-address/actor-address.entity';
import type { Actor } from '../../actor/actor.entity';
import type { TeamFinanceEditOptions } from './team-finance-edit.options';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../project/project.entity';
import type { FileUpload } from 'graphql-upload-minimal';
import type { TeamFinance } from '../team-finance/team-finance.entity';

@Entity({ customRepository: () => TeamFinanceEditRepository })
export class TeamFinanceEdit extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamFinanceEditRepository;

  @ManyToOne({ type: 'TeamFinance' })
  teamFinance!: TeamFinance;

  @Property({ type: 'text', nullable: true, default: null })
  name!: string;

  @Property({ type: 'text', nullable: true, default: null })
  description: string | null = null;

  @Property({ type: 'float', nullable: true, default: null })
  amount: number | null = null;

  @Enum({ items: () => PaymentMethod, type: EnumType, nullable: true, default: null })
  method: PaymentMethod | null = null;

  @Enum({ items: () => FinanceState, type: EnumType, nullable: true, default: null })
  state: FinanceState | null = null;

  @Enum({ items: () => PayedByType, type: EnumType, nullable: true, default: null })
  payedByType: PayedByType | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  payedAt: Date | null = null;

  @ManyToOne({ type: 'Actor', nullable: true, default: null })
  addedPayedBy: Actor | null = null;

  @Property({ type: 'boolean', default: false })
  removedPayedBy = false;

  @ManyToOne({ type: 'ActorAddress', nullable: true, default: null })
  addedAddress: ActorAddress | null = null;

  @Property({ type: 'boolean', default: false })
  removedAddress = false;

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  addedEvent: Event | null = null;

  @Property({ type: 'boolean', default: false })
  removedEvent = false;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  addedProject: Project | null = null;

  @Property({ type: 'boolean', default: false })
  removedProject = false;

  @ManyToOne({ type: 'FileUpload' })
  addedReceipt: FileUpload | null = null;

  @Property({ type: 'boolean', default: false })
  removedReceipt = false;

  constructor(options: TeamFinanceEditOptions) {
    super(options);
    this.assign(options);
  }
}
