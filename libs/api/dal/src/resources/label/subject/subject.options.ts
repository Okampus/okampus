import type { SubjectProps } from '@okampus/shared/dtos';
import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';

export type SubjectOptions = SubjectProps & TenantScopedOptions;
