import { Factory } from '@mikro-orm/seeder';
import { EventApprovalStep } from '@okampus/api/dal';
import type { EntityManager } from '@mikro-orm/core';
import type { Tenant, Individual, EventApprovalStepOptions } from '@okampus/api/dal';

export class EventApprovalStepSeeder extends Factory<EventApprovalStep> {
  model = EventApprovalStep;

  constructor(
    em: EntityManager,
    private readonly tenant: Tenant,
    private readonly order: number,
    private readonly createdBy: Individual | null
  ) {
    super(em);
  }

  public definition(): EventApprovalStepOptions {
    return {
      stepOrder: this.order,
      name: `Validation step #${this.order}`,
      validators: [],
      notifiees: [],
      createdBy: this.createdBy,
      tenant: this.tenant,
    };
  }
}
