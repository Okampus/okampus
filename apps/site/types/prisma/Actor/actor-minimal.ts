import { Prisma } from '@prisma/client';

export const actorMinimal = Prisma.validator<Prisma.ActorDefaultArgs>()({
  select: { id: true, name: true, type: true },
});

export type ActorMinimal = Prisma.ActorGetPayload<typeof actorMinimal>;
