import type { IDocumentUpload } from '../../file-upload/document-upload/document-upload.interface';
import type { IDocumentEdit } from '../document-edit/document-edit.interface';
import type { IUgc } from '../ugc.interface';
import type { DocumentProps } from './document.props';

export type ITenantDocument = IUgc &
  Required<DocumentProps> & {
    currentVersion?: IDocumentUpload;
    edits: IDocumentEdit[];
  };
