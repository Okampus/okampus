import type { Document } from '../document.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { DocumentEditProps } from '@okampus/shared/dtos';
import type { DocumentType } from '@okampus/shared/enums';

export type DocumentEditOptions = DocumentEditProps &
  TenantScopedOptions & {
    newVersion: FileUpload;
    type: DocumentType;
    document: Document;
  };
