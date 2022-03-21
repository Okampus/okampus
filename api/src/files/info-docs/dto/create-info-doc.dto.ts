import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { SchoolYear } from '../../../shared/lib/types/enums/school-year.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateInfoDocDto extends CreateFileUploadDto {
  @IsOptional()
  @IsEnum(SchoolYear)
  schoolYear?: SchoolYear;

  @IsInt()
  year!: number;

  @IsOptional()
  @IsString()
  docSeries?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isObsolete?: boolean;
}
