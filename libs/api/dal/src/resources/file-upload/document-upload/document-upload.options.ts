import { DocumentUploadType } from '@okampus/shared/enums';
import { FileUploadOptions } from '../file-upload.options';
import { DocumentUploadProps } from '@okampus/shared/dtos';

export type DocumentUploadOptions = DocumentUploadProps &
  FileUploadOptions & {
    numberOfPages?: number;
    numberOfWords?: number;
    documentType: DocumentUploadType;
  };
