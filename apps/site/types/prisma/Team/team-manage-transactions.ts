import { eventOrganizeWithEvent } from '../EventOrganize/event-organize-with-event';
import { legalUnitMinimal } from '../LegalUnit/legal-unit-minimal';
import { moneyAccountWithBankAccountInfo } from '../MoneyAccount/money-account-with-bank-info';
import { projectMinimal } from '../Project/project-minimal';
import { Prisma } from '@prisma/client';

export const teamManageTransactions = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    slug: true,
    actorId: true,
    grantFund: legalUnitMinimal,
    eventOrganizes: eventOrganizeWithEvent,
    moneyAccounts: moneyAccountWithBankAccountInfo,
    projects: projectMinimal,
    teamPaymentMethods: { select: { id: true, name: true, type: true } },
    teamTransactionTypes: { select: { id: true, name: true, isIncome: true } },
  },
});

export type TeamManageTransactions = Prisma.TeamGetPayload<typeof teamManageTransactions>;
