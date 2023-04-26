import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Project } from '../project.entity';
import type { ProjectRoleProps } from '@okampus/shared/dtos';

export type ProjectRoleOptions = ProjectRoleProps &
  TenantScopedOptions & {
    required?: boolean;
    project: Project;
  };
