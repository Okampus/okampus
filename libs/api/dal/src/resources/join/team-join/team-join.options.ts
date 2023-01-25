import { TeamJoinProps } from '@okampus/shared/dtos';
import { Team } from '../../org/team/team.entity';
import { TeamRole } from '../../role/team-role/team-role.entity';
import { JoinOptions } from '../join.options';

export type TeamJoinOptions = TeamJoinProps &
  JoinOptions & {
    team: Team;
    askedRole: TeamRole;
  };
