import { Prisma } from '@prisma/client';

export const tenantLocationMinimal = Prisma.validator<Prisma.TenantLocationDefaultArgs>()({
  select: { id: true, slug: true, name: true },
});

export type TenantLocationMinimal = Prisma.TenantLocationGetPayload<typeof tenantLocationMinimal>;
