import { bankMinimal } from '../Bank/bank-minimal';
import { Prisma } from '@prisma/client';

export const bankRequisitionMinimal = Prisma.validator<Prisma.BankRequisitionDefaultArgs>()({
  select: { bank: bankMinimal, createdAt: true, goCardLessRequisitionId: true, authorizationLink: true },
});

export type BankRequisitionMinimal = Prisma.BankRequisitionGetPayload<typeof bankRequisitionMinimal>;
