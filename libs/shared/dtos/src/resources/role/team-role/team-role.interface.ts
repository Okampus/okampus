import { ITeam } from '../../org/team/team.interface';
import { IRole } from '../role.interface';
import { TeamRoleProps } from './team-role.props';

export type ITeamRole = IRole &
  TeamRoleProps & {
    team?: ITeam;
  };
