import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { ExpenseItemProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { Address } from '../../actor/address/address.entity';

export type ExpenseItemOptions = ExpenseItemProps &
  TenantScopedOptions & {
    address: Address | null;
    attachments?: FileUpload[];
  };
