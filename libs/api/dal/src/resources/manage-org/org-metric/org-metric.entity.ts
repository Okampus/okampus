import { Entity, Enum, Property } from '@mikro-orm/core';
import { OrgMetricType } from '@okampus/shared/enums';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { OrgMetricOptions } from './org-metric.options';

@Entity()
export class OrgMetric extends TenantScopedEntity {
  @Property({ type: 'text' })
  value!: string;

  @Enum(() => OrgMetricType)
  type!: OrgMetricType;

  constructor(options: OrgMetricOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}