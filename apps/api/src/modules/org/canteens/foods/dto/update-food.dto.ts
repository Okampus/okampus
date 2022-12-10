import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDto } from '@canteens/foods/dto/create-food.dto';

export class UpdateFoodDto extends PartialType(CreateFoodDto) {}
