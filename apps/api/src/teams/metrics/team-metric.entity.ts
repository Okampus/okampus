import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamMetricName } from '../../shared/lib/types/enums/team-metric-type.enum';

@Entity()
export class TeamMetric extends BaseEntity {
  @PrimaryKey()
  teamMetricId!: number;

  @Property({ columnType: 'real' })
  value!: number;

  @Enum(() => TeamMetricName)
  name!: TeamMetricName;

  constructor(options: {
    value: number;
    name: TeamMetricName;
  }) {
    super();
    this.value = options.value;
    this.name = options.name;
  }
}
