import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { TeamCategoryProps } from '@okampus/shared/dtos';

export type TeamCategoryOptions = TeamCategoryProps & TenantScopedOptions;
