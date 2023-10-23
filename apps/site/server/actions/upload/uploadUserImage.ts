'use server';

import { withAuth } from '../utils/withAuth';
import { wrapAction } from '../utils/wrapAction';

import { BadRequestError, NotFoundError } from '../../error';

import { prisma } from '../../../database/prisma/db';
import { createActorImage } from '../../../database/prisma/services/upload';

import { enumChecker } from '@okampus/shared/utils';
import { ActorImageType } from '@prisma/client';
import type { NextFormMessages } from '../../types';

const isActorImageType = enumChecker(ActorImageType);

export default wrapAction(async function uploadUserImage(_previous: NextFormMessages, formData: FormData) {
  const authContext = await withAuth();

  const file = formData.get('file');
  if (!file || !(file instanceof File)) throw new BadRequestError('MISSING_FIELD', { field: 'file' });

  const actorImageType = formData.get('actorImageType');
  if (!actorImageType || typeof actorImageType !== 'string' || !isActorImageType(actorImageType))
    throw new BadRequestError('MISSING_FIELD', { field: 'actorImageType' });

  const user = await prisma.user.findFirst({ where: { id: authContext.userId }, select: { actorId: true } });
  if (!user) throw new NotFoundError('NOT_FOUND_USER', { userId: authContext.userId });

  await createActorImage({ actorId: user.actorId, blob: file, actorImageType, authContext });
});
