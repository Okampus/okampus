import { isNonNullObject } from '@okampus/shared/utils';
import { PrismaClient } from '@prisma/client';

const undeletedableEntities = new Set(['Address', 'Log']);

type IncludeOnlyWhereOptions = {
  args: Partial<Record<string, unknown>>;
  where: Record<string, unknown>;
};

const includeOnlyNonDeleted = { deletedAt: null };
function includeOnlyWhere({ args, where }: IncludeOnlyWhereOptions) {
  if (!('where' in args)) args = { ...args, where };
  else if (isNonNullObject(args.where)) args.where = { ...where, ...args.where };

  return args;
}

function generatePrismaClient() {
  const datasourceUrl = `postgres://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.POSTGRES_PUBLISHED_PORT}/${process.env.POSTGRES_DB}`;
  const prisma = new PrismaClient({ datasourceUrl });

  prisma.$extends({
    query: {
      $allModels: {
        $allOperations: async ({ operation, model, args, query }) => {
          if (
            (operation.startsWith('find') && operation !== 'findUnique' && operation !== 'findUniqueOrThrow') ||
            operation.startsWith('unique')
          ) {
            if (!undeletedableEntities.has(model)) args = includeOnlyWhere({ args, where: includeOnlyNonDeleted });
            await query(args);
          }
        },

        // TODO: implemenet soft delete

        // delete
        // findFirst: async ({ model, args, query }) => {
        //   if (!undeletedableEntities.has(model)) args = includeOnlyWhere({ args, where: includeOnlyNonDeleted });
        //   await query(args);
        // },
        // findMany: async ({ model, args, query }) => {
        //   if (!undeletedableEntities.has(model)) args = includeOnlyWhere({ args, where: includeOnlyNonDeleted });
        //   await query(args);
        // },
        // findFirstOrThrow: async ({ model, args, query }) => {
        //   if (!undeletedableEntities.has(model)) args = includeOnlyWhere({ args, where: includeOnlyNonDeleted });
        //   await query(args);
        // },
      },
    },
  });

  return prisma;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? generatePrismaClient();

if (process.env.NODE_ENV === 'production') globalForPrisma.prisma = prisma;
