import type { Event } from '../event/event.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Individual } from '../individual/individual.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { Content } from '../content/content.entity';
import type { ContentMasterProps } from '@okampus/shared/dtos';
import type { Issue } from './issue/issue.entity';

export type ContentMasterOptions = ContentMasterProps &
  TenantScopedOptions & {
    tags?: Tag[];
    event?: Event | null;
    issue?: Issue | null;
    rootContent?: Content;
    contributors?: Individual[];
  };
