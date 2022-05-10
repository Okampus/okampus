import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { BadgeLevel } from '../../shared/lib/types/enums/badge-level.enum';
import { Statistic } from '../../shared/lib/types/enums/statistic.enum';

@Entity()
export class Badge extends BaseEntity {
  @PrimaryKey()
  badgeId!: number;

  // Readable name of the badge
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  description!: string;

  // The number of points given once the badge is unlocked
  @Property()
  pointPrize!: number;

  // The level of the badge, for example Bronze, Silver, Gold, etc.
  @Enum(() => BadgeLevel)
  level!: BadgeLevel;

  // TODO: Add full 'icon' support
  @Property({ type: 'text' })
  icon!: string;

  // The serie the badge is in, for example
  @Property({ type: 'text' })
  serie!: string;

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
    serie: string;
    statistic: Statistic;
    statisticThreshold: number;
  }) {
    super();
    this.name = options.name;
    this.description = options.description;
    this.pointPrize = options.pointPrize;
    this.level = options.level;
    this.icon = options.icon;
    this.serie = options.serie;
    this.statistic = options.statistic;
    this.statisticThreshold = options.statisticThreshold;
  }
}
