import { Prisma } from '@prisma/client';

export const formMinimal = Prisma.validator<Prisma.FormDefaultArgs>()({
  select: { id: true, schema: true },
});

export type FormMinimal = Prisma.FormGetPayload<typeof formMinimal>;
