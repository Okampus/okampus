import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@common/lib/entities/base.entity';
import { MetricName } from '@common/lib/types/enums/metric-name.enum';

@ObjectType()
@Entity()
export class Metric extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ columnType: 'real' })
  value!: number;

  @Field(() => MetricName)
  @Enum(() => MetricName)
  name!: MetricName;

  constructor(options: {
    value: number;
    name: MetricName;
    createdAt: Date;
  }) {
    super();
    this.assign(options);
  }
}
