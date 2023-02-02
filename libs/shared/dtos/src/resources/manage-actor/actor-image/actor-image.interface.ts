import { IActor } from '../../actor/actor.interface';
import { IImageUpload } from '../../file-upload/image-upload/image-upload.interface';
import { ITenantScoped } from '../../tenant-scoped.interface';
import { ActorImageProps } from './actor-image.props';

export type IActorImage = ITenantScoped &
  ActorImageProps & {
    actor?: IActor;
    image?: IImageUpload;
    lastActiveDate: Date | null;
  };
