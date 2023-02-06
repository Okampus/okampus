import type { FileUploadProps } from '@okampus/shared/dtos';
import type { Snowflake } from '@okampus/shared/types';
import type { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../actor/individual/individual.entity';

export type FileUploadOptions = FileUploadProps &
  TenantScopedOptions & {
    id?: Snowflake;
    mime: string;
    name: string;
    size: number;
    uploadedBy: Individual;
    url: string;
  };
