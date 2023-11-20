import { tenantLocationClusterMinimal } from '../TenantLocationCluster/tenant-location-cluster-minimal';
import { Prisma } from '@prisma/client';

export const actorClusterMinimal = Prisma.validator<Prisma.ActorClusterDefaultArgs>()({
  select: { tenantLocationCluster: tenantLocationClusterMinimal },
});

export type ActorClusterMinimal = Prisma.ActorClusterGetPayload<typeof actorClusterMinimal>;
