import type { EntityManager } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { Individual } from '../../../resources/actor/individual/individual.entity';
import { EventApprovalStep } from '../../../resources/manage-tenant/event-approval-step/event-approval-step.entity';
import { EventApprovalStepOptions } from '../../../resources/manage-tenant/event-approval-step/event-approval-step.options';
import { Tenant } from '../../../resources/org/tenant/tenant.entity';

export class EventApprovalStepSeeder extends Factory<EventApprovalStep> {
  tenant: Tenant;
  order: number;
  createdBy: Individual;
  model = EventApprovalStep;

  constructor(em: EntityManager, tenant: Tenant, order: number, createdBy: Individual) {
    super(em);
    this.tenant = tenant;
    this.order = order;
    this.createdBy = createdBy;
  }

  public definition(): EventApprovalStepOptions {
    return {
      order: this.order,
      tenant: this.tenant.tenant,
      name: `Validation step #${this.order}`,
      validators: [],
      notifiees: [],
      tenantOrg: this.tenant,
      createdBy: this.createdBy,
    };
  }
}