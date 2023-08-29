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
import { PaymentMethod, FinanceState, PayedByType, FinanceCategory } from '@okampus/shared/enums';

import type { Team } from '../team.entity';
import type { FinanceOptions } from './finance.options';
import type { Expense } from '../expense/expense.entity';
import type { Event } from '../../event/event.entity';
import type { Project } from '../../team/project/project.entity';
import type { Actor } from '../../actor/actor.entity';
import type { BankAccount } from '../bank-account/bank-account.entity';
import type { Tag } from '../../actor/tag/tag.entity';
import type { Location } from '../../actor/location/location.entity';
import type { User } from '../../user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

@Entity({ customRepository: () => FinanceRepository })
export class Finance extends TenantScopedEntity {
  [EntityRepositoryType]!: FinanceRepository;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'float' })
  amount!: number;

  @Property({ type: 'boolean', default: false })
  isOnline = false;

  @Enum({ items: () => PaymentMethod, type: EnumType })
  method!: PaymentMethod;

  @Enum({ items: () => FinanceState, default: FinanceState.Completed, type: EnumType })
  state = FinanceState.Completed;

  @Enum({ items: () => FinanceCategory, type: EnumType })
  category!: FinanceCategory;

  @Enum({ items: () => PayedByType, default: PayedByType.Manual, type: EnumType })
  payedByType: PayedByType = PayedByType.Manual;

  @ManyToOne({ type: 'Actor' })
  payedBy!: Actor;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  initiatedBy: User | null = null;

  @Property({ type: 'datetime' })
  payedAt!: Date;

  @ManyToOne({ type: 'Actor' })
  receivedBy!: Actor;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'BankAccount' })
  bankAccount!: BankAccount;

  @OneToOne({ type: 'Expense', inversedBy: 'finance', nullable: true, default: null })
  expense: Expense | null = null;

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  event: Event | null = null;

  @ManyToOne({ type: 'Location', nullable: true, default: null })
  location: Location | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  attachments = new Collection<FileUpload>(this);

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  constructor(options: FinanceOptions) {
    super(options);
    this.assign(options);
  }
}
