import prisma from '../../../database/prisma/db';
import { selectByIdDto } from '../dtos/selectById';
import { protectedProcedure } from '../trpc';

export const getTeamLogs = protectedProcedure.input(selectByIdDto).query(async ({ input }) => {
  // TODO: add permission checks
  return await prisma.log.findMany({
    where: { teamId: input },
    include: { createdBy: { include: { actor: true } } },
  });
});
