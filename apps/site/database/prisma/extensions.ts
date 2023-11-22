import { isNonNullObject } from '@okampus/shared/utils';
import { Prisma } from '@prisma/client';
import type { PrismaPromise } from '@prisma/client';

const undeletedableEntities = new Set(['Address', 'Bank', 'Log']);
const includeOnlyNonDeleted = { deletedAt: null };

type IncludeOnlyWhereOptions = { args: Partial<Record<string, unknown>>; where: Record<string, unknown> };
function includeOnlyWhere({ args, where }: IncludeOnlyWhereOptions): Record<string, unknown> {
  if (!args) args = { where };
  else if (!('where' in args)) args = { ...args, where };
  else if (isNonNullObject(args.where)) args.where = { ...where, ...args.where }; // args.where overrides where (i.e. use { deletedAt: undefined, NOT: { deletedAt: null } } to select deleted entities})

  return args;
}

export const softDeleteExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    name: 'softDelete',
    model: {
      $allModels: {
        // @ts-expect-error - PrismaPromise should be used instead of Promise
        async delete<T>(this: T, args: Prisma.Args<T, 'findFirst'>['delete']): PrismaPromise<boolean> {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const context = Prisma.getExtensionContext(this) as any;
          if (!context.$name) throw new Error('Cannot get model name');
          if (undeletedableEntities.has(context.$name)) throw new Error(`Cannot delete ${context.$name} entity`);
          const result = await context.update({ where: args.where, data: { deletedAt: new Date() } });
          return result !== null;
        },
        // @ts-expect-error - PrismaPromise should be used instead of Promise
        async deleteMany<T>(this: T, args: Prisma.Args<T, 'findFirst'>['delete']): PrismaPromise<boolean> {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const context = Prisma.getExtensionContext(this) as any;
          if (!context.$name) throw new Error('Cannot get model name');
          if (undeletedableEntities.has(context.$name)) throw new Error(`Cannot delete ${context.$name} entity`);
          const result = await context.update({ where: args.where, data: { deletedAt: new Date() } });
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return await (query as any)(includeOnlyWhere({ args, where: includeOnlyNonDeleted }));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return await (query as any)(args as any);
        },
      },
    },
  });
});
