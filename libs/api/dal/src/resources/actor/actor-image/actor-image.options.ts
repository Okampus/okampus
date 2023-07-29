import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorImageProps } from './actor-image.props';
import type { Actor } from '../../actor/actor.entity';

export type ActorImageOptions = ActorImageProps &
  TenantScopedOptions & {
    actor: Actor;
    image: FileUpload;
  };
