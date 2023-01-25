import { SubjectProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';

export type SubjectOptions = SubjectProps & TenantScopedOptions;
