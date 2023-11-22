'use server';

import { withAuth } from '../../utils/withAuth';
import { withErrorHandling } from '../../utils/withErrorHandling';
import { ServerError } from '../../error';

import { createActorImage } from '../../services/upload';

import { withZod } from '../../utils/withZod';
import { uploadActorImageSchema } from '../../../schemas/ActorImage/uploadActorImageSchema';

export default withErrorHandling(async function uploadTenantImage(formData: FormData) {
  const authContext = await withAuth({ tenantRole: { canManageTenant: true } });
  const data = await withZod({ formData, zodSchema: uploadActorImageSchema });

  const upload = await createActorImage({ actorId: authContext.tenant.actorId, authContext, ...data });
  if (!upload) throw new ServerError('UNKNOWN_ERROR');
});
