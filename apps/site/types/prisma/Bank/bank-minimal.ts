import { Prisma } from '@prisma/client';

export const bankMinimal = Prisma.validator<Prisma.BankDefaultArgs>()({
  select: {
    goCardLessInstitutionId: true,
    name: true,
    bic: true,
    transactionTotalDays: true,
    actor: { select: { avatar: true } },
  },
});

export type BankMinimal = Prisma.BankGetPayload<typeof bankMinimal>;
