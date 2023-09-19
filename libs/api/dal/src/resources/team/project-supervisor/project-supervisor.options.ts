import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { User } from '../../user/user.entity';
import type { Project } from '../project/project.entity';

export type ProjectSupervisorOptions = TenantScopedOptions & {
  project: Project;
  user: User;
  title?: string;
};
