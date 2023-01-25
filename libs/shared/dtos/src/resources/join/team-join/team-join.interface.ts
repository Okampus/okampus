import { ITeam } from '../../org/team/team.interface';
import { ITeamRole } from '../../role/team-role/team-role.interface';
import { IJoin } from '../join.interface';
import { TeamJoinProps } from './team-join.props';

export type ITeamJoin = IJoin &
  TeamJoinProps & {
    team?: ITeam;
    askedRole?: ITeamRole;
    receivedRole?: ITeamRole | null;
  };
