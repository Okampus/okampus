import type { IIndividual } from '../../actor/individual/individual.interface';
import type { IDocumentUpload } from '../../file-upload/document-upload/document-upload.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { DocumentEditProps } from './document-edit.props';

export type IDocumentEdit = ITenantScoped &
  DocumentEditProps & {
    documentUpload?: IDocumentUpload;
    editedBy?: IIndividual;
  };
