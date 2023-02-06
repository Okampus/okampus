import type { ContentProps } from '@okampus/shared/dtos';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Ugc } from '../ugc.entity';
import type { UgcOptions } from '../ugc.options';

export type ContentOptions = ContentProps &
  UgcOptions & {
    attachments?: FileUpload[];
    parent?: Ugc | null;
  };
