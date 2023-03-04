import type { DocumentEditProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { Individual } from '../../actor/individual/individual.entity';
import type { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';

export type DocumentEditOptions = DocumentEditProps &
  TenantScopedOptions & {
    newVersion: DocumentUpload;
    editedBy: Individual;
    order: number;
  };
