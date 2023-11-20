'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { insertPaymentMethodSchema } from '../../../schemas/TeamPaymentMethod/insertPaymentMethodSchema';

import prisma from '../../../database/prisma/db';

import type { FormMessages } from '../types';

export default withErrorHandling(async function insertPaymentMethod(
  _previous: FormMessages<bigint>,
  formData: FormData,
) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: insertPaymentMethodSchema });

  const paymentMethod = await prisma.teamPaymentMethod.create({ data: { ...data, createdById: authContext.userId } });

  return { data: paymentMethod.id };
});
