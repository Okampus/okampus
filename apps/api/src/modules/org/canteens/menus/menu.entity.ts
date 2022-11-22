import {
  Collection,
  Entity,
  Index,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { TransformCollection } from '@meta/shared/lib/decorators/transform-collection.decorator';
import { BaseEntity } from '@meta/shared/lib/entities/base.entity';
import type { Food } from '../foods/food.entity';

@Entity()
export class Menu extends BaseEntity {
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

  constructor(options: {
    date: Date;
  }) {
    super();
    this.assign(options);
  }
}
