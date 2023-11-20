import { eventApprovalStepMinimal } from '../EventApprovalStep/event-approval-step-minimal';
import { userMinimal } from '../User/user-minimal';
import { Prisma } from '@prisma/client';

export const eventApprovalMinimal = Prisma.validator<Prisma.EventApprovalDefaultArgs>()({
  select: {
    id: true,
    createdBy: userMinimal,
    isApproved: true,
    eventApprovalStep: eventApprovalStepMinimal,
    message: true,
  },
});

export type EventApprovalMinimal = Prisma.EventApprovalGetPayload<typeof eventApprovalMinimal>;
