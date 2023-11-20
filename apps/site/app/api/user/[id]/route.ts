import prisma from '../../../../database/prisma/db';
import { NotFoundError } from '../../../../server/error';
import { withAuth } from '../../../../server/utils/withAuth';
import { userDetails } from '../../../../types/prisma/User/user-details';
import { prismaSerialize } from '../../../../utils/prisma-serialize';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await withAuth();

  const user = await prisma.user.findFirst({ where: { id: BigInt(params.id) }, select: userDetails.select });
  if (!user) throw new NotFoundError('NOT_FOUND_USER');
  return new Response(prismaSerialize(user), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
