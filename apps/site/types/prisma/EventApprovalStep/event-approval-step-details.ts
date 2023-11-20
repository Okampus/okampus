import { eventApprovalStepMinimal } from './event-approval-step-minimal';
import { Prisma } from '@prisma/client';

export const eventApprovalStepDetails = Prisma.validator<Prisma.EventApprovalStepDefaultArgs>()({
  select: { ...eventApprovalStepMinimal.select, nextSteps: true, previousStep: true },
});

export type EventApprovalStepDetails = Prisma.EventApprovalStepGetPayload<typeof eventApprovalStepDetails>;
