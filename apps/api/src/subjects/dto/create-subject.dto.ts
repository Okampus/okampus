import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { SchoolYear } from '../../shared/lib/types/enums/school-year.enum';

export class CreateSubjectDto {
  @Length(1, 10)
  @IsString()
  subjectId: string;

  @Length(1, 100)
  @IsString()
  name: string;

  @Length(1, 100)
  @IsString()
  englishName: string;

  @IsEnum(SchoolYear)
  schoolYear: SchoolYear;

  @IsOptional()
  @IsString()
  description?: string;
}
