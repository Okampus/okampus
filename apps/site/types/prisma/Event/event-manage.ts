import { eventMinimal } from './event-minimal';
import { eventApprovalStepMinimal } from '../EventApprovalStep/event-approval-step-minimal';
import { Prisma } from '@prisma/client';

export const eventManage = Prisma.validator<Prisma.EventDefaultArgs>()({
  select: { ...eventMinimal.select, state: true, nextApprovalStep: eventApprovalStepMinimal },
});

export type EventMinimal = Prisma.EventGetPayload<typeof eventMinimal>;
