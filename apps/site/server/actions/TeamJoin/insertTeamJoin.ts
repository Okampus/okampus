'use server';

import { withErrorHandling } from '../../utils/withErrorHandling';
import { withAuth } from '../../utils/withAuth';

import prisma from '../../../database/prisma/db';

import { withZod } from '../../utils/withZod';

import { insertTeamJoinSchema } from '../../../schemas/TeamJoin/insertTeamJoinSchema';
import { BadRequestError, NotFoundError } from '../../error';

import type { FormMessages } from '../types';

export default withErrorHandling(async function insertTeamJoin(_previous: FormMessages, formData: FormData) {
  const authContext = await withAuth();
  const { teamId, submission } = await withZod({ formData, zodSchema: insertTeamJoinSchema });

  const team = await prisma.team.findFirst({
    where: { id: teamId },
    select: { joinForm: { select: { id: true, schema: true } } },
  });
  if (!team) throw new NotFoundError('NOT_FOUND_TEAM', { teamId });

  // TODO: find existing teamJoin

  let joinFormSubmissionId: bigint | undefined;
  if (team.joinForm?.schema) {
    if (!submission) throw new BadRequestError('INVALID_FIELD', { formSubmissionSchema: true });
    const formSubmission = await prisma.formSubmission.create({
      data: { formId: team.joinForm.id, submission: submission, createdById: authContext.userId },
    });
    joinFormSubmissionId = formSubmission.id;
  }

  await prisma.teamJoin.create({
    data: { teamId, joinedById: authContext.userId, createdById: authContext.userId, joinFormSubmissionId },
  });
});
