import { registerEnumType } from '@nestjs/graphql';

export enum FoodType {
  Starter = 'Starter',
  Dish = 'Dish',
  Dessert = 'Dessert',
}

registerEnumType(FoodType, { name: 'FoodType' });
