'use server';

import { prisma } from '../../../database/prisma/db';
import { ForbiddenError, NotFoundError } from '../../error';

import type { AuthContext } from './withAuth';
import type { Prisma, Tenant } from '@prisma/client';

type WithTenantPermission = { tenant: Tenant; tenantMemberId: bigint | null };
type WithTenantPermissionOptions = {
  authContext: AuthContext;
  role?: Prisma.TenantRoleWhereInput;
};
export async function withTenantPermission({
  authContext,
  role,
}: WithTenantPermissionOptions): Promise<WithTenantPermission> {
  const tenant = await prisma.tenant.findFirst({ where: { domain: authContext.tenant.domain } });
  if (!tenant) throw new NotFoundError('NOT_FOUND_TENANT');

  const tenantMember = await prisma.tenantMember.findFirst({
    where: {
      id: tenant.id,
      userId: authContext.userId,
      ...(role && { tenantMemberRoles: { some: { tenantRole: role } } }),
    },
  });
  if (!tenantMember && authContext.role !== 'admin') throw new ForbiddenError('UNAUTHORIZED_TENANT');

  return { tenant, tenantMemberId: tenantMember?.id ?? null };
}
