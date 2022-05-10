import { IsEnum, IsOptional, IsString } from 'class-validator';
import { FoodType } from '../../../shared/lib/types/enums/food-type.enum';

export class CreateFoodDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  nutritionals?: string;

  @IsString()
  @IsOptional()
  allergens?: string;

  @IsEnum(FoodType)
  type: FoodType;
}
