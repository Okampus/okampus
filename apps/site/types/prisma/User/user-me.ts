import { userMinimal } from './user-minimal';
import { teamRoleMinimal } from '../TeamRole/team-role-minimal';
import { tenantMinimal } from '../Tenant/tenant-minimal';
import { teamMinimal } from '../Team/team-minimal';
import { Prisma } from '@prisma/client';

export const userMe = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    ...userMinimal.select,
    eventJoins: { select: { id: true, event: true } },
    following: { select: { id: true, followedActorId: true } },
    teamMemberships: {
      select: { id: true, teamMemberRoles: { select: { teamRole: teamRoleMinimal } }, team: teamMinimal },
    },
    teamJoins: { select: { id: true, team: { select: { id: true, slug: true } } } },
    tenantScope: tenantMinimal,
    adminRoles: { select: { id: true, canManageTenantEntities: true } },
  },
});

export type UserMe = Prisma.UserGetPayload<typeof userMe>;
