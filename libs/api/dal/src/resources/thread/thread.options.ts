import type { Event } from '../event/event.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Individual } from '../individual/individual.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { Content } from '../content/content.entity';
import type { ThreadProps } from '@okampus/shared/dtos';
import type { Issue } from '../issue/issue.entity';

export type ThreadOptions = ThreadProps &
  TenantScopedOptions & {
    tags?: Tag[];
    event?: Event | null;
    issue?: Issue | null;
    rootContent?: Content;
    contributors?: Individual[];
  };
