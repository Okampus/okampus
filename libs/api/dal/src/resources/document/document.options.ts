import type { DocumentType } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { DocumentProps } from './document.props';
import type { Subject } from '../class-group/subject/subject.entity';

export type DocumentOptions = DocumentProps &
  TenantScopedOptions & {
    type: DocumentType;
    file: FileUpload;
    subject?: Subject;
  };
