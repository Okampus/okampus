import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { TagProps } from '@okampus/shared/dtos';
import { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';
import { Individual } from '../../actor/individual/individual.entity';

export type TagOptions = TagProps &
  TenantScopedOptions & {
    iconImage?: ImageUpload | null;
    createdBy?: Individual | null; // null for system
  };
