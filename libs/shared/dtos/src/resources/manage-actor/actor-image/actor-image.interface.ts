import type { IActor } from '../../actor/actor.interface';
import type { IImageUpload } from '../../file-upload/image-upload/image-upload.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { ActorImageProps } from './actor-image.props';

export type IActorImage = ITenantScoped &
  ActorImageProps & {
    actor?: IActor;
    image?: IImageUpload;
    lastActiveDate: Date | null;
  };
