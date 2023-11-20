import { eventOrganizeWithOrganizers } from './event-organize-with-organizers';
import { eventManage } from '../Event/event-manage';
import { formSubmissionMinimal } from '../FormSubmission/form-submission-minimal';
import { Prisma } from '@prisma/client';

export const eventOrganizeManage = Prisma.validator<Prisma.EventOrganizeDefaultArgs>()({
  select: {
    ...eventOrganizeWithOrganizers.select,
    event: { select: { ...eventManage.select, eventApprovalSubmission: formSubmissionMinimal } },
  },
});

export type EventOrganizeManage = Prisma.EventOrganizeGetPayload<typeof eventOrganizeManage>;
