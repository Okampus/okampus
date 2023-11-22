import { ErrorCode, ForbiddenError, NotFoundError } from '../../../server/error';
import { withAuth } from '../../../server/utils/withAuth';
import { withTeamPermission } from '../../../server/utils/withTeamPermission';

import debug from 'debug';

const debugLog = debug('okampus:api:auth');
debug.enable('okampus:api:auth');

export async function GET(request: Request) {
  const url = new URL(request.url);

  const isDomainAdmin = url.searchParams.get('isDomainAdmin') || false;
  const teamSlug = url.searchParams.get('teamSlug') || null;

  try {
    const authContext = await withAuth(isDomainAdmin ? { tenantRole: { canManageTenant: true } } : {});
    if (teamSlug) await withTeamPermission({ authContext, teamIdOrSlug: teamSlug });
  } catch (error) {
    if (error instanceof ForbiddenError) return new Response(ErrorCode.Forbidden, { status: 403 });
    if (error instanceof NotFoundError) {
      if (error.key === 'NOT_FOUND_TENANT') return new Response('NOT_FOUND_TENANT', { status: 404 });
      else if (error.key === 'NOT_FOUND_TEAM') return new Response('NOT_FOUND_TEAM', { status: 404 });
    }
    return new Response(ErrorCode.Unauthorized, { status: 401 });
  }

  return new Response('OK');
}
