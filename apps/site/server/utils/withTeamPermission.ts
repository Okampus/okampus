import { ForbiddenError, NotFoundError } from '../error';

import prisma from '../../database/prisma/db';

import { teamMinimal } from '../../types/prisma/Team/team-minimal';
import { teamMemberMinimal } from '../../types/prisma/TeamMember/team-member-minimal';

import type { AuthContext } from './withAuth';
import type { TeamMinimal } from '../../types/prisma/Team/team-minimal';
import type { Prisma } from '@prisma/client';

type WithTeamPermission = { team: TeamMinimal; teamMemberId: bigint | null };
type WithTeamPermissionOptions = {
  authContext: AuthContext;
  teamIdOrSlug: bigint | string;
  role?: Prisma.TeamRoleWhereInput;
  requiredRole?: Prisma.RequiredRoleWhereInput;
};
export async function withTeamPermission({
  authContext,
  teamIdOrSlug,
  role,
  requiredRole,
}: WithTeamPermissionOptions): Promise<WithTeamPermission> {
  'use server';

  const where = {
    ...(typeof teamIdOrSlug === 'string' ? { slug: teamIdOrSlug } : { id: teamIdOrSlug }),
    tenantScopeId: authContext.tenant.id,
  };

  const team = await prisma.team.findFirst({ where, select: teamMinimal.select });
  if (!team) throw new NotFoundError('NOT_FOUND_TEAM');

  if (authContext.role === 'admin') return { team, teamMemberId: null };

  const teamMember = await prisma.teamMember.findFirst({
    where: {
      userId: authContext.userId,
      teamId: team.id,
      ...(role && { teamMemberRoles: { some: { teamRole: role } } }),
      ...(requiredRole && { requiredRoles: { some: requiredRole } }),
    },
    select: teamMemberMinimal.select,
  });

  if (!teamMember) throw new ForbiddenError('UNAUTHORIZED_TEAM');
  return { team, teamMemberId: teamMember.id };
}
