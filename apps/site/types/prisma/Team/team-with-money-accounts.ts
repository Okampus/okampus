import { teamWithProjects } from './team-with-projects';
import { projectWithEvents } from '../Project/project-with-events';
import { Prisma } from '@prisma/client';

export const teamWithMoneyAccounts = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    ...teamWithProjects.select,
    projects: projectWithEvents,
    moneyAccounts: { select: { id: true, name: true, type: true } },
  },
});

export type TeamWithMoneyAccounts = Prisma.TeamGetPayload<typeof teamWithMoneyAccounts>;
