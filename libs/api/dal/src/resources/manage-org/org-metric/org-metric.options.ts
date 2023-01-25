import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { OrgMetricProps } from '@okampus/shared/dtos';

export type OrgMetricOptions = OrgMetricProps & TenantScopedOptions;
