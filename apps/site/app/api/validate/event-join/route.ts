import prisma from '../../../../database/prisma/db';
import { withAuth } from '../../../../server/utils/withAuth';
import { userMinimal } from '../../../../types/prisma/User/user-minimal';
import { ApprovalState, Prisma, ProcessedVia } from '@prisma/client';

export const eventJoinWithPresence = Prisma.validator<Prisma.EventJoinDefaultArgs>()({
  select: {
    id: true,
    event: { select: { slug: true, name: true } },
    joinedBy: userMinimal,
    state: true,
    participationProcessedAt: true,
    isPresent: true,
  },
});
export type EventJoinWithPresence = Prisma.EventJoinGetPayload<typeof eventJoinWithPresence>;

export const eventJoinWithProcessedBy = Prisma.validator<Prisma.EventJoinDefaultArgs>()({
  select: {
    isPresent: true,
    participationProcessedBy: userMinimal,
  },
});
export type EventJoinWithProcessedBy = Prisma.EventJoinGetPayload<typeof eventJoinWithProcessedBy>;

export type ValidateEventJoin = EventJoinWithPresence | (EventJoinWithPresence & EventJoinWithProcessedBy);

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const { userId } = await withAuth();

  const id = BigInt(searchParams.get('id') || '');
  const force = searchParams.get('force') === 'true';

  const isEventSupervisor = { eventSupervisors: { some: { userId } } };
  const isTeamEventManager = {
    team: { teamMembers: { some: { teamMemberRoles: { some: { teamRole: { canManageEvents: true } } }, userId } } },
  };

  const eventJoin = await prisma.eventJoin.findUnique({
    select: eventJoinWithPresence.select,
    where: { id, event: { eventOrganizes: { some: { OR: [isEventSupervisor, isTeamEventManager] } } } },
  });

  if (!eventJoin) throw new Error('Event join not found');
  if (
    eventJoin.state !== ApprovalState.Approved ||
    ((eventJoin.isPresent === false || eventJoin.participationProcessedAt) && !force)
  )
    return Response.json(eventJoin);

  // If eventJoin has not been processed or force is true, approve the eventJoin
  const eventJoinUpdate = await prisma.eventJoin.update({
    where: { id },
    data: {
      isPresent: true,
      participationProcessedAt: new Date(),
      participationProcessedById: userId,
      participationProcessedVia: ProcessedVia.QR,
    },
    select: eventJoinWithProcessedBy.select,
  });

  return Response.json({ ...eventJoin, ...eventJoinUpdate });
}
