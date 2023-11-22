import { Prisma } from '@prisma/client';

export const reactionMinimal = Prisma.validator<Prisma.ReactionDefaultArgs>()({
  select: { id: true, type: true, createdById: true },
});

export type ReactionMinimal = Prisma.ReactionGetPayload<typeof reactionMinimal>;
