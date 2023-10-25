import prisma from '../../../database/prisma/db';
import { selectByIdDto } from '../dtos/selectById';
import { protectedProcedure } from '../trpc';

export const getTenantLogs = protectedProcedure.input(selectByIdDto).query(async ({ input }) => {
  // TODO: add permission checks
  return await prisma.log.findMany({
    where: { tenantId: input },
    include: { createdBy: { include: { actor: true } } },
  });
});
