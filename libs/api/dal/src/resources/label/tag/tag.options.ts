import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { TagProps } from '@okampus/shared/dtos';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import type { Individual } from '../../actor/individual/individual.entity';

export type TagOptions = TagProps &
  TenantScopedOptions & {
    iconImage?: ImageUpload | null;
    createdBy?: Individual | null; // null for system
  };
