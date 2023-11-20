'use server';

import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { upsertFavoriteSchema } from '../../../schemas/Favorite/upsertFavoriteSchema';

import prisma from '../../../database/prisma/db';

import type { FormMessages } from '../types';

export default withErrorHandling(async function upsertReaction(_previous: FormMessages<boolean>, formData: FormData) {
  const authContext = await withAuth();
  const data = await withZod({ formData, zodSchema: upsertFavoriteSchema });

  const linkedEntityId = data.type === 'event' ? { eventId: data.id } : { postId: data.id };

  const isFavorited = await prisma.favorite.findFirst({
    where: { ...linkedEntityId, createdById: authContext.userId },
  });

  const promise = isFavorited
    ? prisma.favorite.delete({ where: { id: isFavorited.id } })
    : prisma.favorite.create({ data: { ...linkedEntityId, createdById: authContext.userId } });

  await promise;

  return { data: true };
});
