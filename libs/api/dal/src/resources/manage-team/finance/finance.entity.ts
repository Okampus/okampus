import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Collection, Embedded, Entity, Enum, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { PaymentMethod, FinanceCategory, FinanceState } from '@okampus/shared/enums';
import { Team } from '../../org/team/team.entity';
import { TeamMember } from '../../membership/team-member/team-member.entity';
import { TenantEvent } from '../../content-master/event/event.entity';
import { FinanceOptions } from './finance.options';
import { Project } from '../project/project.entity';
import { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';
import { Address } from '@okampus/shared/dtos';

@Entity()
export class Finance extends TenantScopedEntity {
  @Property({ type: 'text' })
  transaction!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'datetime' })
  paymentDate!: Date;

  @Embedded(() => Address)
  address!: Address;

  @Property({ type: 'float' })
  amountDue!: number;

  @Property({ type: 'float' })
  amountPayed!: number;

  @Enum(() => PaymentMethod)
  paymentMethod!: PaymentMethod;

  @Enum(() => FinanceState)
  state!: FinanceState;

  @Enum(() => FinanceCategory)
  category!: FinanceCategory;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'TeamMember' })
  addedBy!: TeamMember;

  @ManyToOne({ type: 'TenantEvent', nullable: true })
  linkedEvent: TenantEvent | null = null;

  @ManyToOne({ type: 'Project', nullable: true })
  linkedProject: Project | null = null;

  @ManyToMany({ type: 'DocumentUpload' })
  linkedDocuments = new Collection<DocumentUpload>(this);

  // TODO: manage reimbursements

  constructor(options: FinanceOptions) {
    if (!options.amountPayed) options.amountPayed = options.amountDue;

    super({ tenant: options.tenant });
    this.assign(options);
  }
}
