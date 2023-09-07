import { getEventApprovalStepsData } from './data/event-approval-step.data';
import { EventApprovalStep } from '@okampus/api/dal';

import type { S3Client } from '@aws-sdk/client-s3';
import type { Tenant } from '@okampus/api/dal';

export async function seedEventApprovalSteps(s3Client: S3Client | null, tenant: Tenant): Promise<EventApprovalStep[]> {
  const eventApprovalStepsData = await getEventApprovalStepsData(s3Client, tenant);
  return eventApprovalStepsData.map(
    (eventApprovalStep) =>
      new EventApprovalStep({
        name: eventApprovalStep.name,
        order: eventApprovalStep.order,
        createdBy: null,
        tenantScope: tenant,
      }),
  );
}
