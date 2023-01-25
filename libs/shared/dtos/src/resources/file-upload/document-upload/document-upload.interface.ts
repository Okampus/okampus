import { DocumentUploadType } from '@okampus/shared/enums';
import { IFileUpload } from '../file-upload.interface';

export type IDocumentUpload = IFileUpload & {
  numberOfPages: number | null;
  numberOfWords: number | null;
  documentType: DocumentUploadType;
};
