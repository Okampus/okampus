'use server';

import { withErrorHandling } from '../../utils/withErrorHandling';
import { withAuth } from '../../utils/withAuth';

import prisma from '../../../database/prisma/db';

import { withZod } from '../../utils/withZod';
import { insertRequiredDocumentSchema } from '../../../schemas/RequiredDocument/insertRequiredDocumentSchema';

import { ALL } from '@okampus/shared/consts';
import { revalidatePath } from 'next/cache';
import { TeamType } from '@prisma/client';

export default withErrorHandling(async function insertRequiredDocument(formData: FormData) {
  const authContext = await withAuth({ tenantRole: { canManageTenant: true } });
  const { teamType, ...data } = await withZod({ formData, zodSchema: insertRequiredDocumentSchema });

  const teamTypes = teamType === ALL ? Object.values(TeamType) : [teamType];
  await prisma.requiredDocument.create({
    data: { ...data, teamTypes, tenantScopeId: authContext.tenant.id, createdById: authContext.userId },
  });

  revalidatePath(`/[locale]/${authContext.tenant.domain}/manage/admin/required-documents`);
  revalidatePath(`/[locale]/${authContext.tenant.domain}/manage/team/documents`);
});
