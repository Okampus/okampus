'use server';

import { withAuth } from '../utils/withAuth';
import { wrapAction } from '../utils/wrapAction';

import { withTeamPermission } from '../utils/withTeamPermission';
import { BadRequestError, ServerError } from '../../error';
import { getTranslation } from '../../ssr/getTranslation';
import { getNextLang } from '../../ssr/getLang';

import { createActorImage } from '../../../database/prisma/services/upload';

import { enumChecker } from '@okampus/shared/utils';
import { ActorImageType } from '@prisma/client';
import type { FormMessages } from '../../types';

const isActorImageType = enumChecker(ActorImageType);

export default wrapAction(async function uploadTeamImage(_previous: FormMessages, formData: FormData) {
  const { t } = await getTranslation(getNextLang());

  const authContext = await withAuth();

  const file = formData.get('file');
  if (!file || !(file instanceof File)) throw new BadRequestError('MISSING_FIELD', { field: 'file' });

  const actorImageType = formData.get('actorImageType');
  if (!actorImageType || typeof actorImageType !== 'string' || !isActorImageType(actorImageType))
    throw new BadRequestError('MISSING_FIELD', { field: 'actorImageType' });

  const slug = formData.get('slug');
  if (!slug || typeof slug !== 'string') return { errors: { root: t('server-errors', 'MISSING_SLUG') } };

  const { team } = await withTeamPermission({ authContext, slug, role: { canManageProfile: true } });

  const upload = await createActorImage({ actorId: team.actorId, blob: file, actorImageType, authContext });
  if (!upload) throw new ServerError('UNKNOWN_ERROR');

  return;
});
