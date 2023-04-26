import type { Team } from '../team/team.entity';
import type { Vote } from './vote/vote.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { ContentProps } from '@okampus/shared/dtos';
import type { Upload } from '../upload/upload';
import type { Content } from './content.entity';
import type { Report } from './report/report.entity';
import type { Favorite } from './favorite/favorite.entity';
import type { Reaction } from './reaction/reaction.entity';
import type { ContentEdit } from './content-edit/content-edit.entity';
import type { Event } from '../event/event.entity';

export type ContentOptions = ContentProps &
  TenantScopedOptions & {
    parent?: Content | null;
    attachments?: Upload[];
    votes?: Vote[];
    reports?: Report[];
    favorites?: Favorite[];
    reactions?: Reaction[];
    edits?: ContentEdit[];
    teams?: Team[];
    event?: Event | null;
  };