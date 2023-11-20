'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { insertCashAccountSchema } from '../../../schemas/BankAccount/insertCashAccountSchema';

import prisma from '../../../database/prisma/db';

import type { FormMessages } from '../types';

export default withErrorHandling(async function insertCashAccount(_previous: FormMessages, formData: FormData) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: insertCashAccountSchema });

  await prisma.moneyAccount.create({ data: { ...data, createdById: authContext.userId } });
});
