import type { RoleMinimalInfo } from './role.info';
import type { UserMinimalInfo } from './user.info';

export type TeamMemberMinimalInfo = {
  user: UserMinimalInfo;
  teamMemberRoles?: {
    role?: RoleMinimalInfo;
  }[];
};
