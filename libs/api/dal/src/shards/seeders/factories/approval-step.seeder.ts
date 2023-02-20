import { EventApprovalStep } from '../../../resources/manage-tenant/event-approval-step/event-approval-step.entity';
import { Factory } from '@mikro-orm/seeder';
import type { EntityManager } from '@mikro-orm/core';
import type { Individual } from '../../../resources/actor/individual/individual.entity';
import type { EventApprovalStepOptions } from '../../../resources/manage-tenant/event-approval-step/event-approval-step.options';
import type { Tenant } from '../../../resources/org/tenant/tenant.entity';

export class EventApprovalStepSeeder extends Factory<EventApprovalStep> {
  model = EventApprovalStep;

  constructor(
    em: EntityManager,
    private readonly tenant: Tenant,
    private readonly order: number,
    private readonly createdBy: Individual
  ) {
    super(em);
  }

  public definition(): EventApprovalStepOptions {
    return {
      order: this.order,
      name: `Validation step #${this.order}`,
      validators: [],
      notifiees: [],
      tenantOrg: this.tenant,
      createdBy: this.createdBy,
      tenant: this.tenant.tenant,
    };
  }
}
