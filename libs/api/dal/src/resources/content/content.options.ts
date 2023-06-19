import type { Team } from '../team/team.entity';
import type { Vote } from './vote/vote.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { ContentProps } from '@okampus/shared/dtos';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Content } from './content.entity';
import type { Report } from './report/report.entity';
import type { Favorite } from './favorite/favorite.entity';
import type { Reaction } from './reaction/reaction.entity';
import type { Event } from '../event/event.entity';

export type ContentOptions = ContentProps &
  TenantScopedOptions & {
    parent?: Content | null;
    attachments?: FileUpload[];
    votes?: Vote[];
    reports?: Report[];
    favorites?: Favorite[];
    reactions?: Reaction[];
    team?: Team | null;
    event?: Event | null;
  };
