import type { TagType } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { TagProps } from './tag.props';
import type { FileUpload } from '../../file-upload/file-upload.entity';

export type TagOptions = TagProps &
  TenantScopedOptions & {
    type: TagType;
    image?: FileUpload;
  };
