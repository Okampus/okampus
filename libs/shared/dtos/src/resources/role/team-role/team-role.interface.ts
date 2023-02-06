import type { ITeam } from '../../org/team/team.interface';
import type { IRole } from '../role.interface';
import type { TeamRoleProps } from './team-role.props';

export type ITeamRole = IRole &
  TeamRoleProps & {
    team?: ITeam;
  };
