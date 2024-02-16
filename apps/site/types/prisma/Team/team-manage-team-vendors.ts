import { teamVendorMinimal } from '../TeamVendor/team-vendor-minimal';
import { Prisma } from '@prisma/client';

export const teamManageTeamVendors = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    id: true,
    slug: true,
    actorId: true,
    teamVendors: teamVendorMinimal,
  },
});

export type TeamManageTeamVendors = Prisma.TeamGetPayload<typeof teamManageTeamVendors>;
