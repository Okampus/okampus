import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { ActorImageProps } from '@okampus/shared/dtos';
import type { Actor } from '../../actor/actor.entity';
import type { ImageUpload } from '../../file-upload/image-upload/image-upload.entity';

export type ActorImageOptions = ActorImageProps &
  TenantScopedOptions & {
    actor: Actor;
    image: ImageUpload;
  };
