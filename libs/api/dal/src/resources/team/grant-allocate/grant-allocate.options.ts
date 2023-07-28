import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { GrantAllocateProps } from './grant-allocate.props';
import type { Individual } from '../../individual/individual.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Grant } from '../grant/grant.entity';
import type { Finance } from '../finance/finance.entity';

export type GrantAllocateOptions = GrantAllocateProps &
  TenantScopedOptions & {
    receivedAmountProcessedBy?: Individual | null;
    receivedAmountProcessedAt?: Date | null;
    grant: Grant;
    finance?: Finance | null;
    signature?: FileUpload | null;
    generatedDocument?: FileUpload | null;
    attachments?: FileUpload[];
  };
