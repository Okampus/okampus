import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { GrantProps } from './grant.props';
import type { User } from '../../user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Project } from '../../project/project.entity';

export type GrantOptions = GrantProps &
  TenantScopedOptions & {
    receivedAmountProcessedBy?: User | null;
    receivedAmountProcessedAt?: Date | null;
    team: Team;
    signature?: FileUpload | null;
    generatedDocument?: FileUpload | null;
    attachments?: FileUpload[];
    projects?: Project[];
  };
