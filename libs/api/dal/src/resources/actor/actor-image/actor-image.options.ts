import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { TenantScopableOptions } from '../../tenant-scoped.entity';
import type { ActorImageProps } from './actor-image.props';
import type { Actor } from '../../actor/actor.entity';

export type ActorImageOptions = ActorImageProps &
  TenantScopableOptions & {
    actor: Actor;
    image: FileUpload;
  };
