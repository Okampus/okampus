import type { ITeam } from '../../org/team/team.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { TeamCategoryProps } from './team-category.props';

export type ITeamCategory = ITenantScoped &
  TeamCategoryProps & {
    teams?: ITeam[];
  };
