'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { insertTransactionTypeSchema } from '../../../schemas/TeamTransactionType/insertTransactionTypeSchema';

import prisma from '../../../database/prisma/db';

export default withErrorHandling(async function insertTransactionType(formData: FormData) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: insertTransactionTypeSchema });

  const transactionType = await prisma.teamTransactionType.create({
    data: { ...data, createdById: authContext.userId },
  });

  return transactionType.id;
});
