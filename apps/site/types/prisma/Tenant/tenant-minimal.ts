import { actorWithTags } from '../Actor/actor-with-tags';
import { Prisma } from '@prisma/client';

export const tenantMinimal = Prisma.validator<Prisma.TenantDefaultArgs>()({
  select: { id: true, actorId: true, domain: true, pointName: true, actor: actorWithTags },
});

export type TenantMinimal = Prisma.TenantGetPayload<typeof tenantMinimal>;
