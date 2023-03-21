import { FinanceRepository } from './finance.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';

import { Collection, Embedded, Entity, Enum, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { PaymentMethod, FinanceCategory, FinanceState } from '@okampus/shared/enums';
import { Address } from '@okampus/shared/dtos';
import { TransformCollection } from '@okampus/api/shards';

import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { FinanceOptions } from './finance.options';
import type { Project } from '../project/project.entity';
import type { Team } from '../../org/team/team.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { User } from '../../actor/user/user.entity';

@Entity({ customRepository: () => FinanceRepository })
export class Finance extends TenantScopedEntity {
  @Property({ type: 'text' })
  transaction!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'datetime' })
  paymentDate!: Date;

  @Enum({ items: () => PaymentMethod, type: 'string' })
  paymentMethod!: PaymentMethod;

  @Embedded(() => Address, { nullable: true })
  address: Address | null = null;

  @Property({ type: 'float' })
  amountDue!: number;

  @Property({ type: 'float' })
  amountPayed!: number;

  @Enum({ items: () => FinanceState, type: 'string' })
  state!: FinanceState;

  @Enum({ items: () => FinanceCategory, type: 'string' })
  category!: FinanceCategory;

  @ManyToOne({ type: 'Team' })
  team!: Team;

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

    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
