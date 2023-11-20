import { teamRoleMinimal } from '../TeamRole/team-role-minimal';
import { Prisma } from '@prisma/client';

export const missionMinimal = Prisma.validator<Prisma.MissionDefaultArgs>()({
  select: { id: true, teamRole: teamRoleMinimal, description: true, name: true },
});

export type MissionMinimal = Prisma.MissionGetPayload<typeof missionMinimal>;
