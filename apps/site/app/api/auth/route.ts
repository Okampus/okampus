import { ErrorCode } from '../../../server/error';
import { withAuth } from '../../../server/utils/withAuth';
import { withTeamPermission } from '../../../server/utils/withTeamPermission';

export async function GET(request: Request) {
  const url = new URL(request.url);

  const isDomainAdmin = url.searchParams.get('isDomainAdmin') || false;
  const teamSlug = url.searchParams.get('teamSlug') || null;

  try {
    const authContext = await withAuth(isDomainAdmin ? { tenantRole: { canManageTenant: true } } : {});
    if (teamSlug) await withTeamPermission({ authContext, teamIdOrSlug: teamSlug });
  } catch (error) {
    console.error({ error });
    return new Response(ErrorCode.Unauthorized, { status: 401 });
  }

  return new Response('OK');
}
