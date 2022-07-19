import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/lib/entities/base.entity';
import { MetricName } from '../shared/lib/types/enums/metric-name.enum';

@Entity()
export class Metric extends BaseEntity {
  @PrimaryKey()
  metricId!: number;

  @Property({ columnType: 'real' })
  value!: number;

  @Enum(() => MetricName)
  name!: MetricName;

  constructor(options: {
    value: number;
    name: MetricName;
    createdAt: Date;
  }) {
    super();
    this.createdAt = options.createdAt;
    this.value = options.value;
    this.name = options.name;
  }
}

export interface MetricSlim {
  createdAt: Date;
  name: string;
  value: number;
}
