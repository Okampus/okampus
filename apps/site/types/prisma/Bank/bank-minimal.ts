import { actorWithAvatar } from '../Actor/actor-with-avatar';
import { Prisma } from '@prisma/client';

export const bankMinimal = Prisma.validator<Prisma.BankDefaultArgs>()({
  select: {
    goCardLessInstitutionId: true,
    name: true,
    bic: true,
    transactionTotalDays: true,
    actor: actorWithAvatar,
  },
});

export type BankMinimal = Prisma.BankGetPayload<typeof bankMinimal>;
