'use server';

import { withAuth } from '../utils/withAuth';
import { wrapAction } from '../utils/wrapAction';
import { BadRequestError, ServerError } from '../../error';

import { createActorImage } from '../../../database/prisma/services/upload';

import { enumChecker } from '@okampus/shared/utils';
import { ActorImageType } from '@prisma/client';
import type { FormMessages } from '../../types';

const isActorImageType = enumChecker(ActorImageType);

export default wrapAction(async function uploadTenantImage(_previous: FormMessages, formData: FormData) {
  const authContext = await withAuth({ tenantRole: { canManageTenant: true } });

  const file = formData.get('file');
  if (!file || !(file instanceof Blob)) throw new BadRequestError('MISSING_FIELD', { field: 'file' });

  const actorImageType = formData.get('actorImageType');
  if (!actorImageType || typeof actorImageType !== 'string' || !isActorImageType(actorImageType))
    throw new BadRequestError('MISSING_FIELD', { field: 'actorImageType' });

  const upload = await createActorImage({
    actorId: authContext.tenant.actorId,
    blob: file,
    actorImageType,
    authContext,
  });
  if (!upload) throw new ServerError('UNKNOWN_ERROR');
});
