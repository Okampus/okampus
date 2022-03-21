import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { StudyDocCategoryType } from '../../../shared/lib/types/types/docs-category.type';

export class CategoryTypesDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(StudyDocCategoryType, { each: true })
  categories?: StudyDocCategoryType[];
}
