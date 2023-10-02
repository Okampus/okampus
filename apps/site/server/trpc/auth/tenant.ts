import { prisma } from '../../../database/prisma/db';
import { TenantRoleType } from '@okampus/shared/enums';
import { isIn, toTitleCase } from '@okampus/shared/utils';
import type { UserinfoResponse } from 'openid-client';

const roleMap = {
  student: TenantRoleType.Student,
  teacher: TenantRoleType.Teacher,
  admin: TenantRoleType.Administration,
};

export async function createOrConnectTenantUser(tenantScopeId: bigint, userInfo: UserinfoResponse) {
  if (!userInfo.email) return null;

  const existingUser = await prisma.user.findFirst({ where: { actor: { email: userInfo.email } } });
  if (existingUser) return existingUser;

  const [firstName, ...middleNames] = userInfo.given_name?.split(' ') ?? [];

  const roleType =
    userInfo.role && typeof userInfo.role === 'string' && isIn(userInfo.role, roleMap)
      ? roleMap[userInfo.role]
      : TenantRoleType.Student;

  const tenantRole = await prisma.tenantRole.findFirst({ where: { type: roleType, tenantScopeId } });
  if (!tenantRole) return null;

  const user =
    existingUser ??
    (await prisma.user.create({
      data: {
        actor: { create: { email: userInfo.email, name: `${firstName} ${userInfo.family_name}`, tenantScopeId } },
        tenantMemberships: {
          create: {
            tenantScope: { connect: { id: tenantScopeId } },
            tenantMemberRoles: { create: { tenantRoleId: tenantRole.id } },
          },
        },
        slug: userInfo.sub,
        firstName,
        middleNames,
        lastName: toTitleCase(userInfo.family_name ?? ''),
        originalTenantScope: { connect: { id: tenantScopeId } },
      },
    }));

  return user;
}
