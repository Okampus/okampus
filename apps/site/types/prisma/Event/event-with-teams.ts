import { eventMinimal } from './event-minimal';
import { eventOrganizeWithOrganizers } from '../EventOrganize/event-organize-with-organizers';
import { Prisma } from '@prisma/client';

export const eventWithTeams = Prisma.validator<Prisma.EventDefaultArgs>()({
  select: {
    ...eventMinimal.select,
    eventOrganizes: eventOrganizeWithOrganizers,
  },
});

export type EventWithTeams = Prisma.EventGetPayload<typeof eventWithTeams>;
