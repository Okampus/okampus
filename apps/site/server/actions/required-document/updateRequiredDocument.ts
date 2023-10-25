import { wrapAction } from '../utils/wrapAction';
import prisma from '../../../database/prisma/db';
import { BadRequestError } from '../../error';
import { withAuth } from '../utils/withAuth';

import { isStringArray } from '@okampus/shared/utils';
import { TeamType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import type { FormMessages } from '../../types';

export default wrapAction(async function updateRequiredDocument(_previous: FormMessages, formData: FormData) {
  // TODO: use zod & dtos
  const authContext = await withAuth({ tenantRole: { canManageTenant: true } });

  const name = formData.get('name');
  if (typeof name !== 'string') throw new BadRequestError('INVALID_FIELD', { field: 'name' });

  const isRequired = formData.get('isRequired') || false;
  if (typeof isRequired !== 'boolean') throw new BadRequestError('INVALID_FIELD', { field: 'isRequired' });

  const teamTypes = formData.get('teamTypes') || [TeamType.Association];
  if (!isStringArray(teamTypes)) throw new BadRequestError('INVALID_FIELD', { field: 'teamTypes' });

  const description = formData.get('description') || '';
  if (typeof description !== 'string') throw new BadRequestError('INVALID_FIELD', { field: 'description' });

  await prisma.requiredDocument.create({
    data: { name, isRequired, teamTypes, description, tenantScopeId: authContext.tenant.id },
  });

  revalidatePath(`/[lang]/${authContext.tenant.domain}/manage/admin/required-documents`);
  revalidatePath(`/[lang]/${authContext.tenant.domain}/manage/team/documents`);
});
