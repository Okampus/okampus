import type { FileUploadKind } from '@okampus/shared/enums';
import type { IIndividual } from '../actor/individual/individual.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { FileUploadProps } from './file-upload.props';

export type IFileUpload = ITenantScoped &
  FileUploadProps & {
    fileUploadKind: FileUploadKind;
    uploadedBy?: IIndividual;
    lastModifiedAt: Date;
    url: string;
    name: string;
    size: number;
    mime: string;
  };
