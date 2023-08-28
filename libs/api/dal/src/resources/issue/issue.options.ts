import type { Tag } from '../actor/tag/tag.entity';
import type { Content } from '../content/content.entity';
import type { User } from '../user/user.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { IssueProps } from './issue.props';

export type IssueOptions = IssueProps &
  TenantScopedOptions & {
    tags?: Tag[];
    rootContent?: Content;
    contributors?: User[];
  };
