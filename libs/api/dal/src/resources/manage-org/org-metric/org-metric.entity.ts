import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, Property } from '@mikro-orm/core';
import { OrgMetricType } from '@okampus/shared/enums';
import type { OrgMetricOptions } from './org-metric.options';

@Entity()
export class OrgMetric extends TenantScopedEntity {
  @Property({ type: 'text' })
  value!: string;

  @Enum({ items: () => OrgMetricType, type: 'string' })
  type!: OrgMetricType;

  constructor(options: OrgMetricOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
