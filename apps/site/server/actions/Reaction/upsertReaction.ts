'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { upsertReactionSchema } from '../../../schemas/Reaction/upsertReactionSchema';

import prisma from '../../../database/prisma/db';

import type { FormMessages } from '../types';

export default withErrorHandling(async function upsertReaction(_previous: FormMessages, formData: FormData) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: upsertReactionSchema });

  const reactionExists = await prisma.reaction.findFirst({
    where: { postId: data.postId, createdById: authContext.userId },
  });

  const createPromise = data.type
    ? [prisma.reaction.create({ data: { postId: data.postId, type: data.type, createdById: authContext.userId } })]
    : [];

  const deletePromise = reactionExists ? [prisma.reaction.delete({ where: { id: reactionExists.id } })] : [];

  await prisma.$transaction([...createPromise, ...deletePromise]);
});
