import { Prisma } from '@prisma/client';

export const socialMinimal = Prisma.validator<Prisma.SocialDefaultArgs>()({
  select: { id: true, type: true, url: true, pseudo: true, order: true },
});

export type SocialMinimal = Prisma.SocialGetPayload<typeof socialMinimal>;
