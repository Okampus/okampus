import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TransformCollection } from '../../shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import type { Food } from '../food/food.entity';

@Entity()
export class DailyMenu extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  @Index()
  date!: Date;

  @ManyToMany()
  @TransformCollection()
  starters = new Collection<Food>(this);

  @ManyToMany()
  @TransformCollection()
  dishes = new Collection<Food>(this);

  @ManyToMany()
  @TransformCollection()
  desserts = new Collection<Food>(this);

  constructor(options: { date: Date }) {
    super();
    this.date = options.date;
  }
}
