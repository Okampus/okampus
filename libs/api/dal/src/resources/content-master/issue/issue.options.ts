import type { Content } from '../../content/content.entity';
import type { Tag } from '../../actor/tag/tag.entity';
import type { Individual } from '../../individual/individual.entity';
import type { TenantScopedOptions } from '../../tenant-scoped.options';
import type { ContentMasterProps } from '@okampus/shared/dtos';

export type IssueOptions = ContentMasterProps &
  TenantScopedOptions & {
    tags?: Tag[];
    rootContent?: Content;
    contributors?: Individual[];
  };
