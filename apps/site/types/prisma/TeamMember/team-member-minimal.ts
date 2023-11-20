import { requiredRoleMinimal } from '../RequiredRole/required-role-minimal';
import { teamRoleMinimal } from '../TeamRole/team-role-minimal';
import { userMinimal } from '../User/user-minimal';
import { Prisma } from '@prisma/client';

export const teamMemberMinimal = Prisma.validator<Prisma.TeamMemberDefaultArgs>()({
  select: {
    id: true,
    user: userMinimal,
    teamMemberRoles: { select: { teamRole: teamRoleMinimal } },
    teamRequiredRoles: { select: { requiredRole: requiredRoleMinimal } },
    managedTeamRoles: teamRoleMinimal,
  },
});

export type TeamMemberMinimal = Prisma.TeamMemberGetPayload<typeof teamMemberMinimal>;
