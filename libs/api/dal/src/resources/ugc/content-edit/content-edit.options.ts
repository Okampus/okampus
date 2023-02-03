import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { ContentEditProps } from '@okampus/shared/dtos';
import { Content } from '../content/content.entity';
import { Individual } from '../../actor/individual/individual.entity';

export type ContentEditOptions = ContentEditProps &
  TenantScopedOptions & {
    content: Content;
    editedBy: Individual;
    order: number;
  };
