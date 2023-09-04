import type { RoleMinimalInfo } from './role.info';
import type { UserMinimalInfo } from './user.info';

export type TeamMemberMinimalInfo = {
  id: string;
  user: UserMinimalInfo;
  teamMemberRoles: {
    id: string;
    teamRole: RoleMinimalInfo;
  }[];
};
