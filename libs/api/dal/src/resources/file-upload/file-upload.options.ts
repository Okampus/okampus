import { FileUploadProps } from '@okampus/shared/dtos';
import { UUID } from '@okampus/shared/types';
import { TenantScopedOptions } from '../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../actor/individual/individual.entity';

export type FileUploadOptions = FileUploadProps &
  TenantScopedOptions & {
    id?: UUID;
    mime: string;
    name: string;
    size: number;
    uploadedBy: Individual;
    url: string;
  };
