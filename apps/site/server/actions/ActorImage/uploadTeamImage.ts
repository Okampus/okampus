'use server';

import { withAuth } from '../../utils/withAuth';
import { withTeamPermission } from '../../utils/withTeamPermission';
import { withZod } from '../../utils/withZod';
import { withErrorHandling } from '../../utils/withErrorHandling';

import { ServerError } from '../../error';

import { createActorImage } from '../../services/upload';

import { uploadTeamImageSchema } from '../../../schemas/ActorImage/uploadTeamImageSchema';

export default withErrorHandling(async function uploadTeamImage(formData: FormData) {
  const authContext = await withAuth();
  const { teamId, ...data } = await withZod({ formData, zodSchema: uploadTeamImageSchema });

  const { team } = await withTeamPermission({ authContext, teamIdOrSlug: teamId, role: { canManageProfile: true } });

  const upload = await createActorImage({ actorId: team.actor.id, authContext, ...data });
  if (!upload) throw new ServerError('UNKNOWN_ERROR');
});
