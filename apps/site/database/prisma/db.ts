import { PrismaClient } from '@prisma/client';

const datasourceUrl = `postgres://${process.env.PSQL_USER}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.POSTGRES_PUBLISHED_PORT}/${process.env.POSTGRES_DB}`;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl });
if (process.env.NODE_ENV === 'production') globalForPrisma.prisma = prisma;
