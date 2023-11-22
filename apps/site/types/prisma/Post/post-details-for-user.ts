import { eventDetails } from '../Event/event-details';
import { reactionMinimal } from '../Reaction/reaction-minimal';
import { userMinimal } from '../User/user-minimal';

import { Prisma } from '@prisma/client';

export const postDetailsForUser = (userId: bigint) =>
  Prisma.validator<Prisma.PostDefaultArgs>()({
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: { select: { reactions: true } },
      reactions: { where: { createdById: userId }, select: reactionMinimal.select },
      favorites: { where: { id: userId }, select: { createdAt: true } },
      announcingEvent: eventDetails,
      createdBy: userMinimal,
    },
  });

export type PostDetailsForUser = Prisma.PostGetPayload<ReturnType<typeof postDetailsForUser>>;
