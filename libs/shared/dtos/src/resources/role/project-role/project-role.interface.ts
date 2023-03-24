import type { IProject } from '../../manage-team/project/project.interface';
import type { IRole } from '../role.interface';
import type { ProjectRoleProps } from './project-role.props';

export type IProjectRole = IRole &
  ProjectRoleProps & {
    project?: IProject;
  };
