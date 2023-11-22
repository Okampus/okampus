'use server';

import { NotFoundError } from '../../error';
import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import prisma from '../../../database/prisma/db';

import { updateTransactionSchema } from '../../../schemas/Transaction/updateTransactionSchema';

import type { PaymentMethod, TransactionType } from '@prisma/client';

async function getPaymentMethod(paymentMethod: PaymentMethod | bigint) {
  if (typeof paymentMethod === 'bigint') {
    const teamPaymentMethod = await prisma.teamPaymentMethod.findFirst({ where: { id: paymentMethod } });
    if (teamPaymentMethod) return { teamPaymentMethodId: teamPaymentMethod.id };
  }

  return { paymentMethod };
}

async function getTransactionType(transactionType: TransactionType | bigint) {
  if (typeof transactionType === 'bigint') {
    const teamTransactionType = await prisma.teamTransactionType.findFirst({ where: { id: transactionType } });
    if (teamTransactionType) return { teamTransactionTypeId: teamTransactionType.id };
  }

  return { transactionType };
}

export default withErrorHandling(async function upsertTransaction(formData: FormData) {
  const authContext = await withAuth();
  const { attachments, transactionId, moneyAccountId, paymentMethod, transactionType, wording, tagIds, ...data } =
    await withZod({ formData, zodSchema: updateTransactionSchema });

  const moneyAccount = transactionId
    ? await prisma.moneyAccount.findFirst({
        select: { id: true },
        where: { transactions: { some: { id: transactionId } } },
      })
    : moneyAccountId
    ? await prisma.moneyAccount.findFirst({ where: { id: moneyAccountId }, select: { id: true } })
    : null;
  if (!moneyAccount) throw new NotFoundError('NOT_FOUND', { moneyAccountId: 'moneyAccount not found' });

  const paymentMethodProps = paymentMethod ? await getPaymentMethod(paymentMethod) : {};
  const transactionTypeProps = transactionType ? await getTransactionType(transactionType) : {};

  const matchingTransactions = await prisma.bankTransaction.findMany({ where: { transactionId } });
  // if (!matchingTransactions.length)
  //   throw new NotFoundError('NOT_FOUND', {
  //     goCardLessTransactionId: "La transaction bancaire correspondante n'existe pas.",
  //   });

  // if (matchingTransactions.bookedAt < data.payedAt) {
  //   throw new BadRequestError('INVALID_FIELD', {
  //     payedAy: 'La date de transaction ne peut pas avoir eu lieu avant la date de comptabilisation.',
  //   });
  // }

  const defaultWording = matchingTransactions.map((transaction) => transaction.wording).join(', ');

  await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      createdById: authContext.userId,
      moneyAccountId: moneyAccount.id,
      wording: wording ?? defaultWording,
      tags: tagIds ? { create: tagIds.map((tagId) => ({ teamTagId: tagId })) } : undefined,
      ...paymentMethodProps,
      ...transactionTypeProps,
      ...(attachments && { attachments: { connect: attachments.map((attachment) => ({ id: attachment })) } }),
      ...data,
    },
  });

  return true;
});
