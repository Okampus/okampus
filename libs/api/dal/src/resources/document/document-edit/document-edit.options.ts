import type { Document } from '../document.entity';
import type { Upload } from '../../upload/upload';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { DocumentEditProps } from '@okampus/shared/dtos';
import type { DocumentType } from '@okampus/shared/enums';

export type DocumentEditOptions = DocumentEditProps &
  TenantScopedOptions & {
    newVersion: Upload;
    type: DocumentType;
    document: Document;
  };
