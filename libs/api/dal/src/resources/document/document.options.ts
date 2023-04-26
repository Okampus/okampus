import type { DocumentType } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { Upload } from '../upload/upload';
import type { DocumentProps } from '@okampus/shared/dtos';
import type { Subject } from '../class-group/subject/subject.entity';

export type DocumentOptions = DocumentProps &
  TenantScopedOptions & {
    type: DocumentType;
    file: Upload;
    subject?: Subject;
  };
