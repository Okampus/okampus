import type { ActorOptions } from '../actor/actor.options';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from './team.entity';
import type { TeamProps } from './team.props';

export type TeamOptions = TeamProps &
  Omit<ActorOptions, 'individual' | 'team'> & {
    parent?: Team | null;
    tags?: Tag[];
    video?: FileUpload;
  };
