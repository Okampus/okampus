import type { Team } from '../team.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { GrantProps } from '@okampus/shared/dtos';
import type { Individual } from '../../individual/individual.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

export type GrantOptions = GrantProps &
  TenantScopedOptions & {
    validatedBy?: Individual | null;
    validatedAt?: Date | null;
    team: Team;
    signature?: FileUpload | null;
    generatedDocument?: FileUpload | null;
    attachments?: FileUpload[];
  };
