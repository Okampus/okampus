import { Prisma } from '@prisma/client';

export const requiredRoleMinimal = Prisma.validator<Prisma.RequiredRoleDefaultArgs>()({
  select: { id: true, color: true, name: true },
});

export type RequiredRoleMinimal = Prisma.RequiredRoleGetPayload<typeof requiredRoleMinimal>;
