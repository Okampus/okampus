'use server';

import { prisma } from '../../database/prisma/db';
import { upload } from '../../database/prisma/services/upload';
import { getS3Key } from '../../utils/s3/get-s3-key';

import { EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { toSlug } from '@okampus/shared/utils';

import type { AuthContextMaybeUser } from '../actions/utils/withAuth';
import type { Prisma } from '@prisma/client';

export type CreateTransactionOptions = {
  data: Omit<Prisma.TransactionUncheckedCreateInput, 'tenantScopeId' | 'createdById'>;
  attachments: Blob[];
  authContext: AuthContextMaybeUser;
};
export async function createTransaction({ data, attachments, authContext }: CreateTransactionOptions) {
  const transaction = await prisma.transaction.create({ data });

  if (attachments.length > 0) {
    await Promise.all(
      attachments.map(async (file, idx) => {
        const key = getS3Key(
          `${transaction.id}-${toSlug(file.name)}-${idx}`,
          EntityNames.Transaction,
          authContext.tenant.id,
          authContext.userId,
        );

        await upload({ blob: file, bucketName: S3BucketNames.Attachments, key, authContext }, async ({ id }) => {
          await prisma.fileUpload.update({ where: { id }, data: { transactionId: transaction.id } });
        });
      }),
    );
  }

  return transaction;
}
