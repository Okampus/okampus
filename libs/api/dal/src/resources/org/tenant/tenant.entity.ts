import { Cascade, Collection, Entity, EntityRepositoryType, OneToMany, OneToOne } from '@mikro-orm/core';
import { TenantOptions } from './tenant.options';
import { Org } from '../org.entity';
import { OrgKind } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
// eslint-disable-next-line import/no-cycle
import { TenantRepository } from './tenant.repository';
import type { EventApprovalStep } from '../../manage-tenant/event-approval-step/event-approval-step.entity';
import type { Form } from '../../ugc/form/form.entity';

@Entity({ customRepository: () => TenantRepository })
export class Tenant extends Org {
  [EntityRepositoryType]!: TenantRepository;

  @OneToMany({ type: 'EventApprovalStep', mappedBy: 'tenantOrg' })
  @TransformCollection()
  eventApprovalSteps = new Collection<EventApprovalStep>(this);

  @OneToOne({ type: 'Form', nullable: true, cascade: [Cascade.ALL] })
  eventValidationForm: Form | null = null;

  constructor(options: TenantOptions) {
    super({ ...options, orgKind: OrgKind.Tenant });
    this.assign({ ...options, orgKind: OrgKind.Tenant });
  }
}
