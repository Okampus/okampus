import { Prisma } from '@prisma/client';

export const actorWithAvatar = Prisma.validator<Prisma.ActorDefaultArgs>()({
  select: { name: true, website: true, email: true, avatar: true, banner: true, type: true },
});

export type ActorWithAvatar = Prisma.ActorGetPayload<typeof actorWithAvatar>;
