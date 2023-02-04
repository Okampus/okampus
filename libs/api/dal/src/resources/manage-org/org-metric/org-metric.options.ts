import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { OrgMetricProps } from '@okampus/shared/dtos';

export type OrgMetricOptions = OrgMetricProps & TenantScopedOptions;
