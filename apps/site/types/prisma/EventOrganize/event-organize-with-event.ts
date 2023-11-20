import { eventMinimal } from '../Event/event-minimal';
import { Prisma } from '@prisma/client';

export const eventOrganizeWithEvent = Prisma.validator<Prisma.EventOrganizeDefaultArgs>()({
  select: { id: true, event: eventMinimal },
});

export type EventOrganizeWithEvent = Prisma.EventOrganizeGetPayload<typeof eventOrganizeWithEvent>;
