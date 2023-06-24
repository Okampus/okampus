import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { GrantAllocateProps } from '@okampus/shared/dtos';
import type { Individual } from '../../individual/individual.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Grant } from '../grant/grant.entity';
import type { Finance } from '../finance/finance.entity';

export type GrantAllocateOptions = GrantAllocateProps &
  TenantScopedOptions & {
    validatedBy?: Individual | null;
    validatedAt?: Date | null;
    grant: Grant;
    finance?: Finance | null;
    signature?: FileUpload | null;
    generatedDocument?: FileUpload | null;
    attachments?: FileUpload[];
  };
