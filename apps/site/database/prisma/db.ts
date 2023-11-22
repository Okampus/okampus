import { softDeleteExtension } from './extensions';
import { PrismaClient } from '@prisma/client';

// TODO: remove createdAt, use snowflake instead?
const prismaClientSingleton = () => {
  const datasourceUrl = `postgres://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.POSTGRES_PUBLISHED_PORT}/${process.env.POSTGRES_DB}`;
  return (
    new PrismaClient({ datasourceUrl })
      .$extends(softDeleteExtension)
      // TODO: hide refreshTokenHash in session
      .$extends({
        name: 'hideSensitiveData',
        result: { user: { passwordHash: { needs: {}, compute: () => 'n1c3tr1y' } } },
      })
  );
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
