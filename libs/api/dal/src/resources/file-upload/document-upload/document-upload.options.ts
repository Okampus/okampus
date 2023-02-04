import type { DocumentUploadType } from '@okampus/shared/enums';
import type { FileUploadOptions } from '../file-upload.options';
import type { DocumentUploadProps } from '@okampus/shared/dtos';

export type DocumentUploadOptions = DocumentUploadProps &
  FileUploadOptions & {
    numberOfPages?: number;
    numberOfWords?: number;
    documentType: DocumentUploadType;
  };
