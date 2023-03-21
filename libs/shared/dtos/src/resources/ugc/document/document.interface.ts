import type { IDocumentUpload } from '../../file-upload/document-upload/document-upload.interface';
import type { IUgc } from '../ugc.interface';
import type { DocumentProps } from './document.props';

export type ITenantDocument = IUgc &
  Required<DocumentProps> & {
    current?: IDocumentUpload;
  };
