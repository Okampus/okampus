import { userMinimal } from './user-minimal';
import { Prisma } from '@prisma/client';

export const userWithPoints = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    ...userMinimal.select,
    points: true,
    missionJoins: { where: { NOT: { pointsProcessedAt: null } } },
    eventJoins: { where: { NOT: { participationProcessedAt: null } }, select: { processedAt: true, event: true } },
  },
});

export type UserWithPoints = Prisma.UserGetPayload<typeof userWithPoints>;
