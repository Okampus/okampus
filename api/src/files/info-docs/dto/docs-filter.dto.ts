import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { SchoolYear } from '../../../shared/lib/types/school-year.enum';
import { PaginateDto } from '../../../shared/modules/pagination/paginate.dto';

export class DocsFilterDto extends PaginateDto {
  @IsOptional()
  @IsEnum(SchoolYear)
  schoolYear?: SchoolYear;

  @IsOptional()
  @IsInt()
  year?: number;
}
