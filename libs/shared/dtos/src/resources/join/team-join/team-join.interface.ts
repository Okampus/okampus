import type { ITeam } from '../../org/team/team.interface';
import type { ITeamRole } from '../../role/team-role/team-role.interface';
import type { IJoin } from '../join.interface';
import type { TeamJoinProps } from './team-join.props';

export type ITeamJoin = IJoin &
  TeamJoinProps & {
    team?: ITeam;
    askedRole?: ITeamRole;
    receivedRole?: ITeamRole | null;
  };
