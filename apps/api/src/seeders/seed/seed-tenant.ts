import { getTenantData } from './data/tenant.data';
import { EventApprovalStep, Form } from '@okampus/api/dal';

import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';

type SeedTenantOptions = {
  s3Client: S3Client | null;
  tenant: Tenant;
};
export async function seedTenant({ s3Client, tenant }: SeedTenantOptions): Promise<Tenant> {
  const tenantData = await getTenantData(s3Client, tenant);

  tenant.actor.name = tenantData.name;
  tenant.pointName = tenantData.pointName;

  if (tenantData.eventValidationForm?.schema) {
    tenant.eventValidationForm = new Form({
      schema: tenantData.eventValidationForm.schema,
      isAllowingEditingAnswers: tenantData.eventValidationForm.isAllowingEditingAnswers,
      tenantScope: tenant,
    });
  }

  const eventApprovalSteps = tenantData.eventApprovalSteps.map(
    (name, idx) => new EventApprovalStep({ name, order: idx, tenantScope: tenant }),
  );
  tenant.eventApprovalSteps.add(eventApprovalSteps);

  return tenant;
}
