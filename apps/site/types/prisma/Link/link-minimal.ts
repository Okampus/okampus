import { Prisma } from '@prisma/client';

export const linkMinimal = Prisma.validator<Prisma.LinkDefaultArgs>()({
  select: { id: true, name: true, description: true, type: true, url: true },
});

export type LinkMinimal = Prisma.LinkGetPayload<typeof linkMinimal>;
