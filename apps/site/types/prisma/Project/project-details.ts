import { projectMinimal } from './project-minimal';
import { eventOrganizeWithEvent } from '../EventOrganize/event-organize-with-event';
import { userMinimal } from '../User/user-minimal';
import { teamMinimal } from '../Team/team-minimal';
import { Prisma } from '@prisma/client';

export const projectDetails = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  select: {
    ...projectMinimal.select,
    banner: true,
    description: true,
    team: teamMinimal,
    eventOrganizes: eventOrganizeWithEvent,
    projectSupervisors: { select: { user: userMinimal } },
  },
});

export type ProjectDetails = Prisma.ProjectGetPayload<typeof projectDetails>;
