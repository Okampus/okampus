import { tenantMinimal } from './tenant-minimal';
import { eventApprovalStepMinimal } from '../EventApprovalStep/event-approval-step-minimal';
import { Prisma } from '@prisma/client';

export const tenantWithProcesses = Prisma.validator<Prisma.TenantDefaultArgs>()({
  select: { ...tenantMinimal.select, eventValidationForm: true, scopedEventApprovalSteps: eventApprovalStepMinimal },
});

export type TenantWithProcesses = Prisma.TenantGetPayload<typeof tenantWithProcesses>;
