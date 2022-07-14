import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { BadgeLevel } from '../../shared/lib/types/enums/badge-level.enum';
import { Statistic } from '../../shared/lib/types/enums/statistic.enum';

@ObjectType()
@Entity()
export class Badge extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  badgeId!: number;

  // Readable name of the badge
  @Field()
  @Property({ type: 'text' })
  name!: string;

  @Field()
  @Property({ type: 'text' })
  description!: string;

  // The number of points given once the badge is unlocked
  @Field(() => Int)
  @Property()
  pointPrize!: number;

  // The level of the badge, for example Bronze, Silver, Gold, etc.
  @Field(() => BadgeLevel)
  @Enum(() => BadgeLevel)
  level!: BadgeLevel;

  // TODO: Add full 'icon' support
  @Field()
  @Property({ type: 'text' })
  icon!: string;

  // The series the badge is in, for example
  @Field()
  @Property({ type: 'text' })
  series!: string;

  // The name of the statistic that the badge is based on
  @Enum(() => Statistic)
  statistic!: Statistic;

  // The number of point needed in the stat to unlock the badge
  @Property()
  statisticThreshold!: number;

  constructor(options: {
    name: string;
    description: string;
    pointPrize: number;
    level: BadgeLevel;
    icon: string;
    series: string;
    statistic: Statistic;
    statisticThreshold: number;
  }) {
    super();
    this.name = options.name;
    this.description = options.description;
    this.pointPrize = options.pointPrize;
    this.level = options.level;
    this.icon = options.icon;
    this.series = options.series;
    this.statistic = options.statistic;
    this.statisticThreshold = options.statisticThreshold;
  }
}
