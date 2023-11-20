'use server';

import { withErrorHandling } from '../../utils/withErrorHandling';
import { withAuth } from '../../utils/withAuth';

import prisma from '../../../database/prisma/db';

import { withZod } from '../../utils/withZod';
import { insertRequiredDocumentSchema } from '../../../schemas/RequiredDocument/insertRequiredDocumentSchema';

import { ALL } from '@okampus/shared/consts';
import { revalidatePath } from 'next/cache';
import { TeamType } from '@prisma/client';
import type { FormMessages } from '../types';

export default withErrorHandling(async function insertRequiredDocument(_previous: FormMessages, formData: FormData) {
  const authContext = await withAuth({ tenantRole: { canManageTenant: true } });
  const { teamType, ...data } = await withZod({ formData, zodSchema: insertRequiredDocumentSchema });

  const teamTypes = teamType === ALL ? Object.values(TeamType) : [teamType];
  await prisma.requiredDocument.create({
    data: { ...data, teamTypes, tenantScopeId: authContext.tenant.id, createdById: authContext.userId },
  });

  revalidatePath(`/[lang]/${authContext.tenant.domain}/manage/admin/required-documents`);
  revalidatePath(`/[lang]/${authContext.tenant.domain}/manage/team/documents`);
});
