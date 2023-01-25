import { TeamRoleProps } from '@okampus/shared/dtos';
import type { Team } from '../../org/team/team.entity';
import { RoleOptions } from '../role.options';

export type TeamRoleOptions = TeamRoleProps &
  RoleOptions & {
    team: Team;
  };
