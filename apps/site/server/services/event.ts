import prisma from '../../database/prisma/db';
import { PostType } from '@prisma/client';

import type { Prisma } from '@prisma/client';

export async function createEvent(data: Prisma.EventCreateInput, createdById: bigint) {
  return await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({ data });
    await tx.post.create({ data: { content: data.summary, type: PostType.Event, eventId: event.id, createdById } });
  });
}
