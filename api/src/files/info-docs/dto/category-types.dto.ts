import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { InfoDocCategoryType } from '../../../shared/lib/types/docs-category.type';

export class CategoryTypesDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(InfoDocCategoryType, { each: true })
  categories?: InfoDocCategoryType[];
}
