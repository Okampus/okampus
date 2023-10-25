import { isNonNullObject } from '@okampus/shared/utils';
import { PrismaClient, Prisma } from '@prisma/client';

const undeletedableEntities = new Set(['Address', 'Log']);
type IncludeOnlyWhereOptions = {
  args: Partial<Record<string, unknown>>;
  where: Record<string, unknown>;
};

const includeOnlyNonDeleted = { deletedAt: null };
function includeOnlyWhere({ args, where }: IncludeOnlyWhereOptions): Record<string, unknown> {
  if (!args) args = { where };
  else if (!('where' in args)) args = { ...args, where };
  else if (isNonNullObject(args.where)) args.where = { ...where, ...args.where }; // where is set first, so args.where will override where

  return args;
}

const prismaClientSingleton = () => {
  const datasourceUrl = `postgres://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.POSTGRES_PUBLISHED_PORT}/${process.env.POSTGRES_DB}`;
  return new PrismaClient({ datasourceUrl }).$extends({
    result: {
      user: {
        passwordHash: {
          needs: {},
          compute: () => '*********************',
        },
      },
    },
    model: {
      $allModels: {
        async delete<T>(this: T, where: Prisma.Args<T, 'findFirst'>['delete']): Promise<boolean> {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const context = Prisma.getExtensionContext(this) as any;
          if (!context.$name) throw new Error('Cannot get model name');
          if (undeletedableEntities.has(context.$name)) throw new Error(`Cannot delete ${context.$name} entity`);
          const result = await context.update({ where, data: { deletedAt: new Date() } });
          return result !== null;
        },
        async deleteMany<T>(this: T, where: Prisma.Args<T, 'findFirst'>['delete']): Promise<boolean> {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const context = Prisma.getExtensionContext(this) as any;
          if (!context.$name) throw new Error('Cannot get model name');
          if (undeletedableEntities.has(context.$name)) throw new Error(`Cannot delete ${context.$name} entity`);
          const result = await context.update({ where, data: { deletedAt: new Date() } });
          return result !== null;
        },
      },
    },
    query: {
      $allModels: {
        $allOperations: async ({ operation, model, args, query }) => {
          if (
            ((operation.startsWith('find') && operation !== 'findUnique' && operation !== 'findUniqueOrThrow') ||
              operation.startsWith('unique')) &&
            !undeletedableEntities.has(model)
          )
            args = includeOnlyWhere({ args, where: includeOnlyNonDeleted });

          return await query(args);
        },
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
