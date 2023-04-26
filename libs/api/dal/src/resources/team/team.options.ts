import type { ActorOptions } from '../actor/actor.options';
import type { Upload } from '../upload/upload';
import type { Tag } from '../actor/tag/tag.entity';
import type { TeamProps } from '@okampus/shared/dtos';

export type TeamOptions = TeamProps &
  Omit<ActorOptions, 'individual' | 'team'> & {
    categories?: Tag[];
    video?: Upload;
  };
