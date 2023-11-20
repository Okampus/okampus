import { actorWithTags } from '../Actor/actor-with-tags';
import { Prisma } from '@prisma/client';

export const tenantWithOidc = Prisma.validator<Prisma.TenantDefaultArgs>()({
  select: {
    actor: actorWithTags,
    isOidcEnabled: true,
    oidcName: true,
    oidcCallbackUri: true,
    oidcClientId: true,
    oidcClientSecret: true,
    oidcDiscoveryUrl: true,
    oidcScopes: true,
  },
});

export type TenantWithOidc = Prisma.TenantGetPayload<typeof tenantWithOidc>;
