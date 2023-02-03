import { DocumentEditProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../../actor/individual/individual.entity';
import { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';

export type DocumentEditOptions = DocumentEditProps &
  TenantScopedOptions & {
    documentUpload: DocumentUpload;
    editedBy: Individual;
    order: number;
  };
