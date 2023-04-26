import type { Upload } from '../../upload/upload';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ActorImageProps } from '@okampus/shared/dtos';
import type { Actor } from '../../actor/actor.entity';

export type ActorImageOptions = ActorImageProps &
  TenantScopedOptions & {
    actor: Actor;
    image: Upload;
    lastActiveDate?: Date | null;
  };
