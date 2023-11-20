import prisma from '../../../database/prisma/db';
import { withAuth } from '../../../server/utils/withAuth';
import { NotFoundError, getErrorStatus } from '../../../server/error';
import { userMe } from '../../../types/prisma/User/user-me';
import { prismaSerialize } from '../../../utils/prisma-serialize';

export async function GET() {
  let user;
  try {
    const { userId } = await withAuth();
    user = await prisma.user.findUnique({ where: { id: userId }, select: userMe.select });
    if (!user) return Response.json(new NotFoundError('NOT_FOUND_USER'), { status: 404 });
  } catch (error) {
    return Response.json(error, { status: getErrorStatus(error) });
  }
  return new Response(prismaSerialize(user), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
