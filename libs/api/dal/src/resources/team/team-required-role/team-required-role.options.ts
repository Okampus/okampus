import type { RequiredRole } from '../../tenant/required-role/required-role.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { TeamMember } from '../team-member/team-member.entity';

export type TeamRequiredRoleOptions = TenantScopedOptions & {
  teamMember: TeamMember;
  requiredRole: RequiredRole;
};
