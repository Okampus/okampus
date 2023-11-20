import { projectMinimal } from '../Project/project-minimal';
import { teamWithSocials } from '../Team/team-with-socials';
import { userMinimal } from '../User/user-minimal';
import { Prisma } from '@prisma/client';

export const eventOrganizeWithOrganizers = Prisma.validator<Prisma.EventOrganizeDefaultArgs>()({
  select: {
    id: true,
    team: teamWithSocials,
    project: projectMinimal,
    eventSupervisors: { select: { user: userMinimal } },
  },
});

export type EventOrganizeWithOrganizers = Prisma.EventOrganizeGetPayload<typeof eventOrganizeWithOrganizers>;
