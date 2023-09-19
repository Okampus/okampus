import type { ProjectProps } from './project.props';
import type { Team } from '../../team/team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

export type ProjectOptions = ProjectProps &
  TenantScopedOptions & {
    team: Team;
    image?: FileUpload;
  };
