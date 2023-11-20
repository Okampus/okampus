import { eventMinimal } from './event-minimal';
import { eventApprovalMinimal } from '../EventApproval/event-approval-minimal';
import { Prisma } from '@prisma/client';

export const eventWithApprovals = Prisma.validator<Prisma.EventDefaultArgs>()({
  select: {
    ...eventMinimal.select,
    eventApprovals: eventApprovalMinimal,
    eventApprovalSubmission: true,
    nextApprovalStep: { select: { id: true, name: true, order: true, nextSteps: true } },
    state: true,
  },
});

export type EventWithApprovals = Prisma.EventGetPayload<typeof eventWithApprovals>;
