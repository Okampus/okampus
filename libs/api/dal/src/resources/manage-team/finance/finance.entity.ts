import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Collection, Embedded, Entity, Enum, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { PaymentMethod, FinanceCategory, FinanceState } from '@okampus/shared/enums';
import type { Team } from '../../org/team/team.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { FinanceOptions } from './finance.options';
import type { Project } from '../project/project.entity';
import { Address } from '@okampus/shared/dtos';
import { TransformCollection } from '@okampus/api/shards';

import { FinanceRepository } from './finance.repository';
import type { Individual } from '../../actor/individual/individual.entity';
import type { User } from '../../actor/user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

@Entity({
  customRepository: () => FinanceRepository,
})
export class Finance extends TenantScopedEntity {
  @Property({ type: 'text' })
  transaction!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'datetime' })
  paymentDate!: Date;

  @Enum(() => PaymentMethod)
  paymentMethod!: PaymentMethod;

  @Embedded(() => Address, { nullable: true })
  address: Address | null = null;

  @Property({ type: 'float' })
  amountDue!: number;

  @Property({ type: 'float' })
  amountPayed!: number;

  @Enum(() => FinanceState)
  state!: FinanceState;

  @Enum(() => FinanceCategory)
  category!: FinanceCategory;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'Individual' })
  createdBy!: Individual;

  // If payedBy is null, then the payment was automatic / TODO: distinguish more cases, such as unknown or outside the system
  @ManyToOne({ type: 'User', nullable: true })
  payedBy: User | null = null;

  @ManyToOne({ type: 'TenantEvent', nullable: true })
  linkedEvent: TenantEvent | null = null;

  @ManyToOne({ type: 'Project', nullable: true })
  linkedProject: Project | null = null;

  @ManyToMany({ type: 'FileUpload' })
  @TransformCollection()
  receipts = new Collection<FileUpload>(this);

  // TODO: manage reimbursements

  constructor(options: FinanceOptions) {
    if (!options.amountPayed) options.amountPayed = options.amountDue;

    super({ tenant: options.tenant });
    this.assign(options);
  }
}
