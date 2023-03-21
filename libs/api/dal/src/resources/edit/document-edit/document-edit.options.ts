import type { DocumentEditProps } from '@okampus/shared/dtos';
import type { EditOptions } from '../edit.options';
import type { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';

export type DocumentEditOptions = DocumentEditProps &
  Omit<EditOptions, 'addedDiff'> & {
    newVersion: DocumentUpload;
  };
