import { actorWithTags } from './actor-with-tags';
import { socialMinimal } from '../Social/social-minimal';
import { actorClusterMinimal } from '../ActorCluster/actor-cluster-minimal';
import { Prisma } from '@prisma/client';

export const actorWithSocials = Prisma.validator<Prisma.ActorDefaultArgs>()({
  select: { ...actorWithTags.select, actorClusters: actorClusterMinimal, bio: true, socials: socialMinimal },
});

export type ActorWithSocials = Prisma.ActorGetPayload<typeof actorWithSocials>;
