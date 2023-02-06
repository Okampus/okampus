import { TenantRepository } from './tenant.repository';
import { Org } from '../org.entity';
import { Cascade, Collection, Entity, EntityRepositoryType, OneToMany, OneToOne } from '@mikro-orm/core';
import { OrgKind } from '@okampus/shared/enums';
import { TransformCollection } from '@okampus/api/shards';
import type { TenantOptions } from './tenant.options';

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
