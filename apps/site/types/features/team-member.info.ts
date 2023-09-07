import type { TeamRoleMinimalInfo } from './team-role.info';
import type { UserMinimalInfo } from './user.info';

export type TeamMemberMinimalInfo = {
  id: string;
  user: UserMinimalInfo;
  teamMemberRoles: {
    id: string;
    teamRole: TeamRoleMinimalInfo;
  }[];
};
