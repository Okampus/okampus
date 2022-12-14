import type { EntityManager } from '@mikro-orm/core';
import { Factory } from '@mikro-orm/seeder';
import { ApprovalStepType } from '../../../src/common/lib/types/enums/approval-step-type.enum';
import { ApprovalStep } from '../../../src/modules/org/tenants/approval-steps/approval-step.entity';
import type { Tenant } from '../../../src/modules/org/tenants/tenant.entity';

export class ApprovalStepFactory extends Factory<ApprovalStep> {
  public static lastId = 0;

  tenant: Tenant;
  step: number;
  model = ApprovalStep;

  constructor(em: EntityManager, tenant: Tenant, step: number) {
    super(em);
    this.tenant = tenant;
    this.step = step;
  }

  public definition(): Partial<ApprovalStep> {
    return {
      id: ApprovalStepFactory.lastId++,
      tenant: this.tenant,
      name: `Étape de validation #${this.step}`,
      step: this.step,
      type: ApprovalStepType.Event,
    };
  }
}
