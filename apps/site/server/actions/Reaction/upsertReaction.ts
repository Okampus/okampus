'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { upsertReactionSchema } from '../../../schemas/Reaction/upsertReactionSchema';

import prisma from '../../../database/prisma/db';

export default withErrorHandling(async function upsertReaction(formData: FormData) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: upsertReactionSchema });

  const reactionExists = await prisma.reaction.findFirst({
    where: { postId: data.postId, createdById: authContext.userId },
  });

  const type = data.type;
  if (reactionExists && type) {
    await prisma.$transaction(async (tx) => {
      await tx.reaction.create({ data: { postId: data.postId, type, createdById: authContext.userId } });
      await tx.reaction.delete({ where: { id: reactionExists.id } });
    });
  } else if (reactionExists) {
    await prisma.reaction.delete({ where: { id: reactionExists.id } });
  } else if (data.type) {
    await prisma.reaction.create({ data: { postId: data.postId, type: data.type, createdById: authContext.userId } });
  }

  return data.type || null;
});
