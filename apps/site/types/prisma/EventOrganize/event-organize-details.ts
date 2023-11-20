import { eventOrganizeWithOrganizers } from './event-organize-with-organizers';
import { eventMinimal } from '../Event/event-minimal';
import { eventApprovalMinimal } from '../EventApproval/event-approval-minimal';
import { eventApprovalStepMinimal } from '../EventApprovalStep/event-approval-step-minimal';
import { Prisma } from '@prisma/client';

export const eventOrganizeDetails = Prisma.validator<Prisma.EventOrganizeDefaultArgs>()({
  select: {
    ...eventOrganizeWithOrganizers.select,
    event: {
      select: {
        ...eventMinimal.select,
        eventApprovalSubmission: true,
        eventApprovals: eventApprovalMinimal,
        nextApprovalStep: eventApprovalStepMinimal,
        state: true,
      },
    },
  },
});

export type EventOrganizeDetails = Prisma.EventOrganizeGetPayload<typeof eventOrganizeDetails>;
