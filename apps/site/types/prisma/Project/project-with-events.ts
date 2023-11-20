import { projectMinimal } from './project-minimal';
import { eventOrganizeWithEvent } from '../EventOrganize/event-organize-with-event';
import { teamMinimal } from '../Team/team-minimal';
import { Prisma } from '@prisma/client';

export const projectWithEvents = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  select: {
    ...projectMinimal.select,
    team: teamMinimal,
    eventOrganizes: eventOrganizeWithEvent,
  },
});

export type ProjectWithEvents = Prisma.ProjectGetPayload<typeof projectWithEvents>;
