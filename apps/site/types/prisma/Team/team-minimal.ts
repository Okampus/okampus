import { actorWithTags } from '../Actor/actor-with-tags';
import { Prisma } from '@prisma/client';

export const teamMinimal = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    slug: true,
    type: true,
    createdAt: true,
    actor: actorWithTags,
    _count: { select: { teamMembers: true, missions: true } },
  },
});

export type TeamMinimal = Prisma.TeamGetPayload<typeof teamMinimal>;
