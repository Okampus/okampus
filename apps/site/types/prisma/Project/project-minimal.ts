import { Prisma } from '@prisma/client';

export const projectMinimal = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  select: { id: true, name: true, slug: true, banner: true, color: true },
});

export type ProjectMinimal = Prisma.ProjectGetPayload<typeof projectMinimal>;
