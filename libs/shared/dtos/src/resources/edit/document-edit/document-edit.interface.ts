import type { IDocumentUpload } from '../../file-upload/document-upload/document-upload.interface';
import type { IEdit } from '../edit.interface';
import type { DocumentEditProps } from './document-edit.props';

export type IDocumentEdit = IEdit &
  Required<DocumentEditProps> & {
    newVersion?: IDocumentUpload;
  };
