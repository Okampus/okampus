import { Prisma } from '@prisma/client';

export const teamRoleMinimal = Prisma.validator<Prisma.TeamRoleDefaultArgs>()({
  select: {
    id: true,
    name: true,
    color: true,
    slug: true,
    type: true,
    canViewTreasury: true,
    canManageTreasury: true,
    canManageProfile: true,
    canViewJoins: true,
    canManageJoins: true,
    canManageMemberRoles: true,
    canManageRoles: true,
    canCreateEvents: true,
    canManageEvents: true,
    canViewDraftEvents: true,
    canCreateActions: true,
    canManageActions: true,
    canCreateContents: true,
    canManageContents: true,
  },
});

export type TeamRoleMinimal = Prisma.TeamRoleGetPayload<typeof teamRoleMinimal>;
