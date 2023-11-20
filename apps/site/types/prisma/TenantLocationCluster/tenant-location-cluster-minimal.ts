import { Prisma } from '@prisma/client';

export const tenantLocationClusterMinimal = Prisma.validator<Prisma.TenantLocationClusterDefaultArgs>()({
  select: { id: true, slug: true, name: true },
});

export type TenantLocationClusterMinimal = Prisma.TenantLocationClusterGetPayload<typeof tenantLocationClusterMinimal>;
