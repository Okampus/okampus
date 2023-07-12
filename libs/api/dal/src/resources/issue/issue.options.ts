import type { Tag } from '../actor/tag/tag.entity';
import type { Content } from '../content/content.entity';
import type { Individual } from '../individual/individual.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { ThreadProps } from '@okampus/shared/dtos';

export type IssueOptions = ThreadProps &
  TenantScopedOptions & {
    tags?: Tag[];
    rootContent?: Content;
    contributors?: Individual[];
  };
