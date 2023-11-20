/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../database/prisma/db';

import { getErrorStatus } from '../../../server/error';
import { withAuth } from '../../../server/utils/withAuth';
import { eventDetails } from '../../../types/prisma/Event/event-details';
import { prismaSerialize } from '../../../utils/prisma-serialize';

import type { EventDetails } from '../../../types/prisma/Event/event-details';

export type EventCursorData = {
  data: EventDetails[];
  metadata: { hasNextPage: boolean };
};

const TAKE = 5;

export async function GET(request: Request) {
  try {
    await withAuth();
    const url = new URL(request.url);
    const take = url.searchParams.get('take');
    const lastCursor = url.searchParams.get('lastCursor') || null;

    const result = await prisma.event.findMany({
      // Do not include the cursor itself in the query result.
      ...(lastCursor && { skip: 1, cursor: { id: BigInt(lastCursor) } }),
      orderBy: { createdAt: 'desc' },
      select: eventDetails.select,
      take: take ? Number.parseInt(take) ?? TAKE : TAKE,
    });

    const last = result.at(-1);
    if (!last) {
      const response: EventCursorData = { data: [], metadata: { hasNextPage: false } };
      return Response.json(response, { status: 200 });
    }

    const cursor = last.id;
    const nextPageCount = await prisma.event.count({ take: 1, skip: 1, cursor: { id: cursor } });

    const response: EventCursorData = { data: result, metadata: { hasNextPage: nextPageCount > 0 } };
    return new Response(prismaSerialize(response), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return Response.json({ error }, { status: getErrorStatus(error) });
  }
}
