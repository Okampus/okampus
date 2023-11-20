import { tenantMinimal } from './tenant-minimal';
import { actorWithSocials } from '../Actor/actor-with-socials';
import { Prisma } from '@prisma/client';

export const tenantDetails = Prisma.validator<Prisma.TenantDefaultArgs>()({
  select: { ...tenantMinimal.select, createdAt: true, actor: actorWithSocials },
});

export type TenantDetails = Prisma.TenantGetPayload<typeof tenantDetails>;
