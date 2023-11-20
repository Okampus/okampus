'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { NotFoundError } from '../../error';

import prisma from '../../../database/prisma/db';
import { createActorImage } from '../../services/upload';

import { uploadActorImageSchema } from '../../../schemas/ActorImage/uploadActorImageSchema';

import type { FormMessages } from '../types';

export default withErrorHandling(async function uploadUserImage(_previous: FormMessages, formData: FormData) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: uploadActorImageSchema });

  const user = await prisma.user.findFirst({ where: { id: authContext.userId }, select: { actorId: true } });
  if (!user) throw new NotFoundError('NOT_FOUND_USER', { userId: authContext.userId });

  await createActorImage({ actorId: user.actorId, authContext, ...data });
});
