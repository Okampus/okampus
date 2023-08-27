import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Role } from '../role/role.entity';
import type { TeamMember } from '../team-member/team-member.entity';

export type TeamMemberRoleOptions = TenantScopedOptions & {
  teamMember: TeamMember;
  role: Role;
};
