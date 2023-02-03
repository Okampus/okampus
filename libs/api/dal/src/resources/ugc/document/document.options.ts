import { DocumentProps } from '@okampus/shared/dtos';
import { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';
import { UgcOptions } from '../ugc.options';

export type DocumentOptions = DocumentProps &
  UgcOptions & {
    documentUpload: DocumentUpload;
  };
