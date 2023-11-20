import { actorWithAvatar } from './actor-with-avatar';
import { tagMinimal } from '../Tag/tag-minimal';
import { Prisma } from '@prisma/client';

export const actorWithTags = Prisma.validator<Prisma.ActorDefaultArgs>()({
  select: {
    id: true,
    ...actorWithAvatar.select,
    email: true,
    status: true,
    actorTags: { select: { tag: tagMinimal } },
  },
});

export type ActorWithTags = Prisma.ActorGetPayload<typeof actorWithTags>;
