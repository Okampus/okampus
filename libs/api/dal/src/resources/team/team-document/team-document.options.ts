import type { DocumentType } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../../tenant-scoped.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { TeamDocumentProps } from './team-document.props';

export type TeamDocumentOptions = TeamDocumentProps &
  TenantScopedOptions & {
    type: DocumentType;
    file: FileUpload;
  };
