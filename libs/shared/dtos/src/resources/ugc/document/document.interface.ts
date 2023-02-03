import { IDocumentUpload } from '../../file-upload/document-upload/document-upload.interface';
import { IDocumentEdit } from '../document-edit/document-edit.interface';
import { IUgc } from '../ugc.interface';
import { DocumentProps } from './document.props';

export type ITenantDocument = IUgc &
  DocumentProps & {
    documentUpload?: IDocumentUpload;
    edits: IDocumentEdit[];
  };
