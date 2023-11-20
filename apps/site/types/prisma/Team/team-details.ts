import { teamMinimal } from './team-minimal';
import { actorWithSocials } from '../Actor/actor-with-socials';
import { formMinimal } from '../Form/form-minimal';

import { teamMemberMinimal } from '../TeamMember/team-member-minimal';
import { teamRoleDetails } from '../TeamRole/team-role-details';
import { Prisma } from '@prisma/client';

export const teamDetails = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: {
    ...teamMinimal.select,
    directorsCategoryName: true,
    managersCategoryName: true,
    membersCategoryName: true,
    expectingPresidentEmail: true,
    expectingSecretaryEmail: true,
    expectingTreasurerEmail: true,
    actor: actorWithSocials,
    teamMembers: teamMemberMinimal,
    teamRoles: teamRoleDetails,
    joinForm: formMinimal,
    children: teamMinimal,
    parent: teamMinimal,
  },
});

export type TeamDetails = Prisma.TeamGetPayload<typeof teamDetails>;
