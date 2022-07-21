import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { FoodType } from '../../shared/lib/types/enums/food-type.enum';

@Entity()
export class Food extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  nutritionals?: string;

  @Property({ type: 'text' })
  allergens?: string;

  @Enum(() => FoodType)
  type!: FoodType;

  constructor(options: {
    name: string;
    nutritionals?: string;
    allergens?: string;
    type: FoodType;
  }) {
    super();
    this.name = options.name;
    this.nutritionals = options.nutritionals;
    this.allergens = options.allergens;
    this.type = options.type;
  }
}
