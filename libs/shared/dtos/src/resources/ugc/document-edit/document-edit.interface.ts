import { IIndividual } from '../../actor/individual/individual.interface';
import { IDocumentUpload } from '../../file-upload/document-upload/document-upload.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { DocumentEditProps } from './document-edit.props';

export type IDocumentEdit = ITenantScoped &
  DocumentEditProps & {
    documentUpload?: IDocumentUpload;
    editedBy?: IIndividual;
  };
