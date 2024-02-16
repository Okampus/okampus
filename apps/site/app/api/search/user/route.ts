import prisma from '../../../../database/prisma/db';

import { withAuth } from '../../../../server/utils/withAuth';
import { userMinimal } from '../../../../types/prisma/User/user-minimal';
import { prismaSerialize } from '../../../../utils/prisma-serialize';

export async function GET(request: Request) {
  await withAuth();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const searchWhere = { contains: search, mode: 'insensitive' } as const;

  const results = await prisma.user.findMany({
    where: { actor: { OR: [{ name: searchWhere }, { email: searchWhere }] } },
    select: userMinimal.select,
    take: 10,
  });

  return Response.json(prismaSerialize(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
