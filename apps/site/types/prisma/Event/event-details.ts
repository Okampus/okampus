import { eventWithTeams } from './event-with-teams';
import { userMinimal } from '../User/user-minimal';
import { Prisma } from '@prisma/client';

export const eventDetails = Prisma.validator<Prisma.EventDefaultArgs>()({
  select: {
    ...eventWithTeams.select,
    createdAt: true,
    joinForm: true,
    locationDetails: true,
    description: true,
    eventJoins: {
      take: 10,
      select: {
        id: true,
        isPresent: true,
        joinedBy: userMinimal,
        participationProcessedAt: true,
        participationProcessedBy: userMinimal,
        participationProcessedVia: true,
      },
    },
  },
});

export type EventDetails = Prisma.EventGetPayload<typeof eventDetails>;
