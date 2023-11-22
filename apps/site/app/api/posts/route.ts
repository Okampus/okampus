/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../database/prisma/db';

import { getErrorStatus } from '../../../server/error';
import { withAuth } from '../../../server/utils/withAuth';

import { postDetailsForUser } from '../../../types/prisma/Post/post-details-for-user';
import { prismaSerialize } from '../../../utils/prisma-serialize';

const TAKE = 5;

export async function GET(request: Request) {
  try {
    const { userId } = await withAuth();
    const url = new URL(request.url);
    const take = Number.parseInt(url.searchParams.get('take') ?? '') || TAKE;
    const lastCursor = url.searchParams.get('lastCursor') || null;

    const result = await prisma.post.findMany({
      // Do not include the cursor itself in the query result.
      ...(lastCursor && { skip: 1, cursor: { id: BigInt(lastCursor) } }),
      orderBy: { createdAt: 'desc' },
      select: postDetailsForUser(userId).select,
      take: take + 1,
    });

    const hasNextPage = result.length > take;
    if (hasNextPage) result.pop();

    const last = result.at(-1);
    if (!last) return Response.json({ data: [], hasNextPage: false }, { status: 200 });
    return new Response(prismaSerialize({ data: result, hasNextPage }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return Response.json({ error }, { status: getErrorStatus(error) });
  }
}
