import { Prisma } from '@prisma/client';

export const bankAccountInfoMinimal = Prisma.validator<Prisma.BankAccountInfoDefaultArgs>()({
  select: { id: true, bank: true, ownerName: true, iban: true },
});

export type BankAccountInfoMinimal = Prisma.BankAccountInfoGetPayload<typeof bankAccountInfoMinimal>;
