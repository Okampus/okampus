import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '@lib/entities/base.entity';
import { FoodType } from '@lib/types/enums/food-type.enum';

@Entity()
export class Food extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  nutritionals: string | null = null;

  @Property({ type: 'text' })
  allergens: string | null = null;

  @Enum(() => FoodType)
  type!: FoodType;

  constructor(options: {
    name: string;
    type: FoodType;
    nutritionals?: string | null;
    allergens?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
