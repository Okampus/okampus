'use server';

import { withErrorHandling } from '../../utils/withErrorHandling';
import { withAuth } from '../../utils/withAuth';
import { withZod } from '../../utils/withZod';

import prisma from '../../../database/prisma/db';

import { updateRequiredDocumentSchema } from '../../../schemas/RequiredDocument/updateRequiredDocumentSchema';
import { revalidatePath } from 'next/cache';

export default withErrorHandling(async function updateRequiredDocument(formData: FormData) {
  const authContext = await withAuth({ tenantRole: { canManageTenant: true } });
  const { id, ...data } = await withZod({ formData, zodSchema: updateRequiredDocumentSchema });

  await prisma.requiredDocument.update({ where: { id }, data });

  revalidatePath(`/[locale]/${authContext.tenant.domain}/manage/admin/required-documents`);
  revalidatePath(`/[locale]/${authContext.tenant.domain}/manage/team/documents`);
});
