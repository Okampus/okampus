import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SchoolYear } from '../../../shared/lib/types/enums/school-year.enum';
import { PaginateDto } from '../../../shared/modules/pagination';

export class DocsFilterDto extends PaginateDto {
  @IsOptional()
  @IsEnum(SchoolYear)
  schoolYear?: SchoolYear;

  @IsOptional()
  @IsInt()
  year?: number;
}
