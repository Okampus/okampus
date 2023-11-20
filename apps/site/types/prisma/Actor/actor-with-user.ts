import { actorWithAvatar } from './actor-with-avatar';
import { Prisma } from '@prisma/client';

export const actorWithUser = Prisma.validator<Prisma.ActorDefaultArgs>()({
  select: { ...actorWithAvatar.select, user: { select: { id: true, slug: true } } },
});

export type ActorWithUser = Prisma.ActorGetPayload<typeof actorWithUser>;
