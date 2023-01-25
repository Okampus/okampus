import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { TagProps } from '@okampus/shared/dtos';

export type TagOptions = TagProps & TenantScopedOptions;
