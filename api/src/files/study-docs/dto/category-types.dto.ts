import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { StudyDocFilter } from '../../../shared/lib/types/enums/docs-filters.enum';

export class CategoryTypesDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(StudyDocFilter, { each: true })
  categories?: StudyDocFilter[];
}
