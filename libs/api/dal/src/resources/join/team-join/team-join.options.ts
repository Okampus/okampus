import type { TeamJoinProps } from '@okampus/shared/dtos';
import type { Team } from '../../org/team/team.entity';
import type { TeamRole } from '../../role/team-role/team-role.entity';
import type { JoinOptions } from '../join.options';

export type TeamJoinOptions = TeamJoinProps &
  JoinOptions & {
    team: Team;
    askedRole: TeamRole;
  };
