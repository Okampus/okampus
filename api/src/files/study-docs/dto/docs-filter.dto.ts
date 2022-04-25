import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Cursus } from '../../../shared/lib/types/enums/cursus.enum';
import { SchoolYear } from '../../../shared/lib/types/enums/school-year.enum';
import { StudyDocType } from '../../../shared/lib/types/enums/study-doc-type.enum';
import { PaginateDto } from '../../../shared/modules/pagination';

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
