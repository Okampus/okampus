import { bankMinimal } from '../Bank/bank-minimal';
import { Prisma } from '@prisma/client';

export const bankAccountInfoMinimal = Prisma.validator<Prisma.BankAccountInfoDefaultArgs>()({
  select: { id: true, bank: bankMinimal, ownerName: true, iban: true },
});

export type BankAccountInfoMinimal = Prisma.BankAccountInfoGetPayload<typeof bankAccountInfoMinimal>;
