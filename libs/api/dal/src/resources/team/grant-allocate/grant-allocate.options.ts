import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { GrantAllocateProps } from './grant-allocate.props';
import type { User } from '../../user/user.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Grant } from '../grant/grant.entity';
import type { Finance } from '../../actor/finance/finance.entity';

export type GrantAllocateOptions = GrantAllocateProps &
  TenantScopedOptions & {
    receivedAmountProcessedBy?: User | null;
    receivedAmountProcessedAt?: Date | null;
    grant: Grant;
    finance?: Finance | null;
    signature?: FileUpload | null;
    generatedDocument?: FileUpload | null;
    attachments?: FileUpload[];
  };
