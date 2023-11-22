'use server';

import { withErrorHandling } from '../../utils/withErrorHandling';
import { withAuth } from '../../utils/withAuth';

import prisma from '../../../database/prisma/db';

import { withZod } from '../../utils/withZod';

import { insertEventJoinSchema } from '../../../schemas/EventJoin/insertEventJoinSchema';
import { BadRequestError, NotFoundError } from '../../error';

export default withErrorHandling(async function insertEventJoin(formData: FormData) {
  const authContext = await withAuth();
  const { eventId, submission } = await withZod({ formData, zodSchema: insertEventJoinSchema });

  const event = await prisma.event.findFirst({
    where: { id: eventId },
    select: { joinForm: { select: { id: true, schema: true } } },
  });
  if (!event) throw new NotFoundError('NOT_FOUND_EVENT', { eventId });

  let joinFormSubmissionId: bigint | undefined;
  if (event.joinForm?.schema) {
    if (!submission) throw new BadRequestError('INVALID_FIELD', { formSubmissionSchema: true });
    const formSubmission = await prisma.formSubmission.create({
      data: { formId: event.joinForm.id, submission: submission, createdById: authContext.userId },
    });
    joinFormSubmissionId = formSubmission.id;
  }

  await prisma.eventJoin.create({
    data: { eventId, joinedById: authContext.userId, createdById: authContext.userId, joinFormSubmissionId },
  });
});
