import type { FileUploadProps } from '@okampus/shared/dtos';

import type { TenantScopedOptions } from '../tenant-scoped.options';

export type FileUploadOptions = FileUploadProps &
  TenantScopedOptions & {
    id?: string;
    mime: string;
    name: string;
    size: number;
    url: string;
  };
