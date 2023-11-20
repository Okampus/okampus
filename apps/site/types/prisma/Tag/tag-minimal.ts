import { Prisma } from '@prisma/client';

export const tagMinimal = Prisma.validator<Prisma.TagDefaultArgs>()({
  select: { name: true, color: true, slug: true },
});

export type TagMinimal = Prisma.TagGetPayload<typeof tagMinimal>;
