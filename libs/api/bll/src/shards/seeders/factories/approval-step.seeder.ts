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
    const name =
      this.order === 1
        ? 'Validation de principe'
        : this.order === 2
        ? 'Validation campus'
        : this.order === 3
        ? 'Validation du directeur'
        : `Validation step #${this.order}`;

    return { order: this.order, name, createdBy: this.createdBy, tenant: this.tenant };
  }
}
