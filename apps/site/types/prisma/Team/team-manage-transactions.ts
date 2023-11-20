import { moneyAccountWithBankAccountInfo } from '../MoneyAccount/money-account-with-bank-info';
import { projectMinimal } from '../Project/project-minimal';
import { eventOrganizeWithEvent } from '../EventOrganize/event-organize-with-event';
import { Prisma } from '@prisma/client';

export const teamManageTransactions = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    slug: true,
    actorId: true,
    moneyAccounts: moneyAccountWithBankAccountInfo,
    teamPaymentMethods: { select: { id: true, name: true, type: true } },
    teamTransactionTypes: { select: { id: true, name: true, isIncome: true } },
    projects: projectMinimal,
    eventOrganizes: eventOrganizeWithEvent,
  },
});

export type TeamManageTransactions = Prisma.TeamGetPayload<typeof teamManageTransactions>;
