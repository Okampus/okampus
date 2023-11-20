'use server';

import { upload } from '../services/upload';

import prisma from '../../database/prisma/db';
import { getS3Key } from '../../utils/s3/get-s3-key';

import { EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { toSlug } from '@okampus/shared/utils';

import type { AuthContextMaybeUser } from '../utils/withAuth';
import type { Prisma } from '@prisma/client';

export type CreateTransactionOptions = {
  data: Omit<Prisma.TransactionUncheckedCreateInput, 'tenantScopeId' | 'createdById'>;
  attachments: { key: string; blob: Blob }[];
  authContext: AuthContextMaybeUser;
};
export async function createTransaction({ data, attachments, authContext }: CreateTransactionOptions) {
  const transaction = await prisma.transaction.create({ data });

  if (attachments.length > 0) {
    await Promise.all(
      attachments.map(async ({ key: fileKey, blob }, idx) => {
        const key = getS3Key(
          `${transaction.id}-${toSlug(fileKey)}-${idx}`,
          EntityNames.Transaction,
          authContext.tenant.id,
          authContext.userId,
        );

        await upload({ blob, bucketName: S3BucketNames.Attachments, key, authContext }, async ({ id }) => {
          await prisma.fileUpload.update({ where: { id }, data: { transactionId: transaction.id } });
        });
      }),
    );
  }

  return transaction;
}
