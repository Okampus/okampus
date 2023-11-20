import { teamMinimal } from './team-minimal';

import { projectMinimal } from '../Project/project-minimal';
import { teamMemberMinimal } from '../TeamMember/team-member-minimal';

import { Prisma } from '@prisma/client';

export const teamWithProjects = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    ...teamMinimal.select,
    projects: projectMinimal,
    teamMembers: teamMemberMinimal,
    tenantScope: { select: { pointName: true } },
  },
});

export type TeamWithProjects = Prisma.TeamGetPayload<typeof teamWithProjects>;
