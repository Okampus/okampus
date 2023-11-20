import { teamRoleMinimal } from './team-role-minimal';
import { teamMemberMinimal } from '../TeamMember/team-member-minimal';
import { Prisma } from '@prisma/client';

export const teamRoleDetails = Prisma.validator<Prisma.TeamRoleDefaultArgs>()({
  select: {
    ...teamRoleMinimal.select,
    manager: teamMemberMinimal,
  },
});

export type TeamRoleDetails = Prisma.TeamRoleGetPayload<typeof teamRoleDetails>;
