import { userMinimal } from '../User/user-minimal';
import { Prisma } from '@prisma/client';

export const teamJoinMinimal = Prisma.validator<Prisma.TeamJoinDefaultArgs>()({
  select: { id: true, joinedBy: userMinimal, joinFormSubmission: true, state: true },
});

export type TeamJoinMinimal = Prisma.TeamJoinGetPayload<typeof teamJoinMinimal>;
