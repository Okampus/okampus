import type { DocumentProps } from '@okampus/shared/dtos';
import type { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';
import type { UgcOptions } from '../ugc.options';

export type DocumentOptions = DocumentProps &
  UgcOptions & {
    newVersion: DocumentUpload;
  };
