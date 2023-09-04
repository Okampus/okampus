import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { TeamRole } from '../team-role/team-role.entity';
import type { TeamMember } from '../team-member/team-member.entity';

export type TeamMemberRoleOptions = TenantScopedOptions & {
  teamMember: TeamMember;
  teamRole: TeamRole;
};
