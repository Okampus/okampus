'use server';

import prisma from '../../../database/prisma/db';

import { NotFoundError } from '../../error';
import { getGoCardLessBankAccounts, getGoCardLessTransactions } from '../../services/bank';

import { withErrorHandling } from '../../utils/withErrorHandling';
import { withTeamPermission } from '../../utils/withTeamPermission';
import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';

import { insertBankAccountsSchema } from '../../../schemas/BankAccount/insertBankAccountsSchema';

import { baseUrl, protocol } from '../../../config';

import { sum } from '@okampus/shared/utils';
import { MoneyAccountType, PaymentMethod, TransactionType } from '@prisma/client';
import { redirect } from 'next/navigation';

import type { GoCardLessParsedBankAccount } from '../../services/bank';
import type { FormMessages } from '../types';

type ProcessedGoCardLessBankAccount = Omit<GoCardLessParsedBankAccount, 'balance' | 'referenceDate' | 'iban'> & {
  iban: string;
  balance: number;
  referenceDate: Date;
};

export default withErrorHandling(async function insertBankAccounts(_previous: FormMessages, formData: FormData) {
  const authContext = await withAuth();
  const { institutionId, teamId, accounts } = await withZod({ formData, zodSchema: insertBankAccountsSchema });

  const { team, teamMemberId } = await withTeamPermission({
    role: { canManageTreasury: true },
    authContext,
    teamIdOrSlug: teamId,
  });

  const requisition = await prisma.bankRequisition.findFirst({
    where: { team: { slug: team.slug, tenantScope: { domain: authContext.tenant.domain } }, bankId: institutionId },
    select: { goCardLessRequisitionId: true, bank: { select: { actorId: true } } },
  });

  if (!requisition) throw new NotFoundError('NOT_FOUND', { institutionId: 'Bank not found' });

  await prisma.bankRequisition.update({
    where: { goCardLessRequisitionId: requisition.goCardLessRequisitionId },
    data: { transactionsLastAccessed: new Date() },
  });

  const realAccounts = await getGoCardLessBankAccounts(requisition.goCardLessRequisitionId);

  const accountsToCreate: ProcessedGoCardLessBankAccount[] = [];
  for (const [index, account] of accounts.entries()) {
    const realAccount = realAccounts.find((realAccount) => realAccount.id === account.id);
    if (!realAccount) throw new NotFoundError('NOT_FOUND', { [`accounts.${index}..id`]: 'Bank account not found' });

    const { iban, balance, currency, referenceDate } = realAccount;
    accountsToCreate.push({
      ...account,
      iban: iban ?? account.iban,
      balance,
      referenceDate: referenceDate ? new Date(referenceDate) : account.referenceDate,
      currency,
    });
  }

  await prisma.$transaction(async (tx) => {
    for (const [idx, account] of accountsToCreate.entries()) {
      const transactions = await getGoCardLessTransactions(account.id, account.currency);

      const bankAccountInfo = await tx.bankAccountInfo.create({
        data: {
          iban: account.iban,
          ownerName: account.ownerName,
          actorId: team.actor.id,
          bankId: institutionId,
        },
      });

      const moneyAccount = await tx.moneyAccount.create({
        data: {
          name: account.name,
          type: idx === 0 ? MoneyAccountType.Primary : MoneyAccountType.Secondary,
          balance: account.balance,
          currency: account.currency,
          details: account.details,
          balanceReferenceDate: account.referenceDate,
          bankAccountInfoId: bankAccountInfo.id,
          teamId,
          goCardLessBankAccountId: account.id,
          goCardLessRequisitionId: requisition.goCardLessRequisitionId,
          createdById: authContext.userId,
        },
      });

      const transactionDifference = sum(transactions.map((transaction) => transaction.amount));
      const initialBalance = account.balance - transactionDifference;

      await tx.transaction.create({
        data: {
          amount: initialBalance,
          payedAt: account.referenceDate,
          moneyAccountId: moneyAccount.id,
          wording: 'Initial',
          counterPartyActorId: requisition.bank.actorId,
          paymentMethod: PaymentMethod.BankTransfer,
          transactionType: TransactionType.Balance,
          approvingTeamMemberId: teamMemberId,
          liableTeamMemberId: teamMemberId,
          note: 'Solde initial',
          teamId: team.id,
        },
      });

      await tx.bankTransaction.createMany({
        data: transactions.map((transaction) => ({ ...transaction, moneyAccountId: moneyAccount.id })),
      });

      for (const {
        goCardLessTransactionId,
        counterPartyName,
        referenceId,
        bookedAt,
        iban,
        ...transaction
      } of transactions) {
        const counterPartyByIban = iban
          ? await tx.bankAccountInfo.findFirst({ where: { iban }, select: { actorId: true } })
          : null;

        await tx.transaction.create({
          data: {
            ...(counterPartyByIban ? { counterPartyId: counterPartyByIban.actorId } : { counterPartyName }),
            referenceNumber: referenceId,
            bankTransactions: { connect: [{ goCardLessTransactionId }] },
            ...transaction,
            payedAt: bookedAt,
            moneyAccountId: moneyAccount.id,
            teamId: team.id,
          },
        });
      }
    }

    await prisma.bankRequisition.update({
      where: { goCardLessRequisitionId: requisition.goCardLessRequisitionId },
      data: { validatedAt: new Date(), accountsLastAccessedAt: new Date() },
    });
  });

  redirect(`${protocol}://${authContext.tenant.domain}.${baseUrl}/manage/team/${team.slug}/bank`);
});
