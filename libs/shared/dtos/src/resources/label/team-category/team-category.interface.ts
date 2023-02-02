import { ITeam } from '../../org/team/team.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { TeamCategoryProps } from './team-category.props';

export type ITeamCategory = ITenantScoped &
  TeamCategoryProps & {
    teams?: ITeam[];
  };
