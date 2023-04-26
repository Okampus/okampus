import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, Property } from '@mikro-orm/core';
import { TeamMetricType } from '@okampus/shared/enums';

import type { TeamMetricOptions } from './team-metric.options';

@Entity()
export class TeamMetric extends TenantScopedEntity {
  @Property({ type: 'text' })
  value!: string;

  @Enum({ items: () => TeamMetricType, type: EnumType })
  type!: TeamMetricType;

  constructor(options: TeamMetricOptions) {
    super(options);
    this.assign(options);
  }
}
