import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { TenantRole } from '../tenant-role/tenant-role.entity';
import type { TenantMember } from '../tenant-member/tenant-member.entity';

export type TenantMemberRoleOptions = TenantScopedOptions & {
  tenantMember: TenantMember;
  tenantRole: TenantRole;
};
