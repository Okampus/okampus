import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { ExpenseItemProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorAddress } from '../../actor/actor-address/actor-address.entity';

export type ExpenseItemOptions = ExpenseItemProps &
  TenantScopedOptions & {
    address: ActorAddress | null;
    attachments?: FileUpload[];
  };
