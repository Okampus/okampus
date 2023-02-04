import type { DocumentUploadType } from '@okampus/shared/enums';
import type { IFileUpload } from '../file-upload.interface';

export type IDocumentUpload = IFileUpload & {
  numberOfPages: number | null;
  numberOfWords: number | null;
  documentType: DocumentUploadType;
};
