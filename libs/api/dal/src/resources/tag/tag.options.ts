import type { TenantScopedOptions } from '../tenant-scoped.entity';
import type { TagProps } from './tag.props';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { TagType } from '@okampus/shared/enums';

export type TagOptions = TagProps &
  TenantScopedOptions & {
    type: TagType;
    image?: FileUpload;
  };
