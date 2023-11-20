import { actorWithAvatar } from '../Actor/actor-with-avatar';
import { tagMinimal } from '../Tag/tag-minimal';
import { Prisma } from '@prisma/client';

export const teamListDetails = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    slug: true,
    type: true,
    parent: { select: { slug: true, actor: { select: { name: true } } } },
    actor: { select: { ...actorWithAvatar.select, status: true, actorTags: { select: { tag: tagMinimal } } } },
    _count: {
      select: { teamMembers: true, missions: true, eventOrganizes: { where: { event: { end: { gte: new Date() } } } } },
    },
  },
});

export type TeamListDetails = Prisma.TeamGetPayload<typeof teamListDetails>;
