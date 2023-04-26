import type { TagType } from '@okampus/shared/enums';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { TagProps } from '@okampus/shared/dtos';
import type { Upload } from '../../upload/upload';

export type TagOptions = TagProps &
  TenantScopedOptions & {
    type: TagType;
    image?: Upload;
  };
