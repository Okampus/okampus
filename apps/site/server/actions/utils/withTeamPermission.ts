'use server';

import { prisma } from '../../../database/prisma/db';
import { ForbiddenError, NotFoundError } from '../../error';

import type { AuthContext } from './withAuth';
import type { Prisma, Team } from '@prisma/client';

type WithTeamPermission = { team: Team; teamMemberId: bigint | null };
type WithTeamPermissionOptions = {
  authContext: AuthContext;
  slug: string;
  role?: Prisma.TeamRoleWhereInput;
  requiredRole?: Prisma.RequiredRoleWhereInput;
};
export async function withTeamPermission({
  authContext,
  slug,
  role,
  requiredRole,
}: WithTeamPermissionOptions): Promise<WithTeamPermission> {
  const team = await prisma.team.findFirst({ where: { slug } });
  if (!team) throw new NotFoundError('NOT_FOUND_TEAM');

  if (authContext.role === 'admin') return { team, teamMemberId: null };

  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: authContext.userId,
      teamId: team.id,
      ...(role && { teamMemberRoles: { some: { teamRole: role } } }),
      ...(requiredRole && { requiredRoles: { some: requiredRole } }),
    },
  });
  if (!teamMember) throw new ForbiddenError('UNAUTHORIZED_TEAM');

  return { team, teamMemberId: teamMember.id };
}
