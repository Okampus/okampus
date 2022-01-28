import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Cursus } from '../../../shared/lib/types/cursus.enum';
import { SchoolYear } from '../../../shared/lib/types/school-year.enum';
import { StudyDocType } from '../../../shared/lib/types/study-doc-type.enum';
import { PaginateDto } from '../../../shared/modules/pagination/paginate.dto';

export class DocsFilterDto extends PaginateDto {
  @IsOptional()
  @IsEnum(SchoolYear)
  schoolYear?: SchoolYear;

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsEnum(StudyDocType)
  type?: StudyDocType;

  @IsOptional()
  @IsEnum(Cursus)
  cursus?: Cursus;
}
