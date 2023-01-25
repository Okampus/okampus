import { FileUploadKind } from '@okampus/shared/enums';
import { IIndividual } from '../actor/individual/individual.interface';
import { ITenantScopedEntity } from '../tenant-scoped.interface';
import { FileUploadProps } from './file-upload.props';

export type IFileUpload = ITenantScopedEntity &
  FileUploadProps & {
    fileUploadKind: FileUploadKind;
    uploadedBy?: IIndividual;
    lastModifiedAt: Date;
    url: string;
    name: string;
    size: number;
    mime: string;
  };
