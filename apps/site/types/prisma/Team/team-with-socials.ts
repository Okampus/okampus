import { teamMinimal } from './team-minimal';
import { actorWithSocials } from '../Actor/actor-with-socials';
import { Prisma } from '@prisma/client';

export const teamWithSocials = Prisma.validator<Prisma.TeamDefaultArgs>()({
  select: { ...teamMinimal.select, actor: actorWithSocials },
});

export type TeamWithSocials = Prisma.TeamGetPayload<typeof teamWithSocials>;
