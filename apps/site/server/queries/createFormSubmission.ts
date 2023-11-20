'use server';

import { BadRequestError, NotFoundError } from '../error';
import { upload } from '../services/upload';

import prisma from '../../database/prisma/db';
import { getS3Key } from '../../utils/s3/get-s3-key';

import { EntityNames, S3BucketNames } from '@okampus/shared/enums';
import { isFormSubmission } from '@okampus/shared/utils';

import type { SubmissionData, SubmissionType } from '@okampus/shared/types';
import type { AuthContextMaybeUser } from '../utils/withAuth';

export type CreateFormSubmission = {
  formId: bigint;
  submissionData: SubmissionData;
  authContext: AuthContextMaybeUser;
};
export async function createFormSubmission({ formId, submissionData, authContext }: CreateFormSubmission) {
  const form = await prisma.form.findFirst({ where: { id: formId }, select: { schema: true, tenantScopeId: true } });
  if (!form) throw new NotFoundError('NOT_FOUND', { formId });

  if (!isFormSubmission(form.schema, submissionData))
    throw new BadRequestError('INVALID_FIELD', { field: 'submission' });

  const submission: SubmissionType = {};

  const formSubmission = await prisma.formSubmission.create({
    data: { formId, submission, createdById: authContext.userId },
  });

  const attachments: bigint[] = [];
  for (const [field, value] of Object.entries(submission)) {
    if (value instanceof Blob) {
      const key = getS3Key(``, EntityNames.FormSubmission, form.tenantScopeId, authContext.userId);
      await upload({ bucketName: S3BucketNames.Attachments, blob: value, key, authContext }, async ({ id }) => {
        attachments.push(id);
      });
    } else if (Array.isArray(value) && typeof value[0] === 'string') {
      // File ID
      try {
        const id = BigInt(value[0]);
        const fileUpload = await prisma.fileUpload.findFirst({ where: { id } });
        if (!fileUpload) throw new NotFoundError('NOT_FOUND', { field, id });
        attachments.push(id);
      } catch {
        throw new BadRequestError('INVALID_FIELD', { field: field });
      }
    } else {
      submission[field] = value;
    }
  }

  await prisma.formSubmission.update({
    data: { formSubmissionAttachments: { connect: attachments.map((id) => ({ id })) } },
    where: { id: formSubmission.id },
  });

  return formSubmission;
}
