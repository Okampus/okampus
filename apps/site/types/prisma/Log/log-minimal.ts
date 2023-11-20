import { userMinimal } from '../User/user-minimal';
import { Prisma } from '@prisma/client';

export const logMinimal = Prisma.validator<Prisma.LogDefaultArgs>()({
  select: {
    id: true,
    context: true,
    createdAt: true,
    createdBy: userMinimal,
    diff: true,
    entityName: true,
    entityId: true,
    note: true,
    type: true,
  },
});

export type LogMinimal = Prisma.LogGetPayload<typeof logMinimal>;
