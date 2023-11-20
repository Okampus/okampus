import { tenantLocationClusterMinimal } from './tenant-location-cluster-minimal';
import { tenantLocationMinimal } from '../TenantLocation/tenant-location-minimal';
import { actorWithTags } from '../Actor/actor-with-tags';
import { ActorType, Prisma } from '@prisma/client';

export const tenantLocationClusterDetails = Prisma.validator<Prisma.TenantLocationClusterDefaultArgs>()({
  select: {
    ...tenantLocationClusterMinimal.select,
    tenantLocations: tenantLocationMinimal,
    actorClusters: { where: { actor: { type: ActorType.Team } }, select: { actor: actorWithTags } },
  },
});

export type TenantLocationClusterDetails = Prisma.TenantLocationClusterGetPayload<typeof tenantLocationClusterDetails>;
