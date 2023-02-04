import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { ContentEditProps } from '@okampus/shared/dtos';
import type { Content } from '../content/content.entity';
import type { Individual } from '../../actor/individual/individual.entity';

export type ContentEditOptions = ContentEditProps &
  TenantScopedOptions & {
    content: Content;
    editedBy: Individual;
    order: number;
  };
