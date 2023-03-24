import type { ProjectRoleProps } from '@okampus/shared/dtos';
import type { Project } from '../../manage-team/project/project.entity';
import type { RoleOptions } from '../role.options';

export type ProjectRoleOptions = ProjectRoleProps &
  RoleOptions & {
    project: Project;
  };
