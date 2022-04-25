import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { InfoDocFilter } from '../../../shared/lib/types/enums/docs-filters.enum';

export class CategoryTypesDto {
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsEnum(InfoDocFilter, { each: true })
  categories?: InfoDocFilter[];
}
