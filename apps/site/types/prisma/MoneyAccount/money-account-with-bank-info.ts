import { bankAccountInfoMinimal } from '../BankAccountInfo/bank-account-info-minimal';
import { teamMinimal } from '../Team/team-minimal';
import { Prisma } from '@prisma/client';

// TODO: select sum, not count
export const moneyAccountWithBankAccountInfo = Prisma.validator<Prisma.MoneyAccountDefaultArgs>()({
  select: {
    id: true,
    currency: true,
    name: true,
    team: teamMinimal,
    type: true,
    _count: { select: { transactions: true } },
    children: {
      select: {
        id: true,
        _count: { select: { transactions: true } },
        balance: true,
        currency: true,
        team: teamMinimal,
      },
    },
    parent: {
      select: {
        id: true,
        _count: { select: { transactions: true } },
        balance: true,
        currency: true,
        team: teamMinimal,
      },
    },
    bankAccountInfo: bankAccountInfoMinimal,
  },
});

export type MoneyAccountWithBankAccountInfo = Prisma.MoneyAccountGetPayload<typeof moneyAccountWithBankAccountInfo>;
