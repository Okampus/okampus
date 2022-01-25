import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { Cursus } from '../../../shared/lib/types/cursus.enum';
import { StudyDocType } from '../../../shared/lib/types/study-doc-type.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateStudyDocDto extends CreateFileUploadDto {
  @IsInt()
  year: number;

  @IsString()
  subject: string;

  @IsEnum(Cursus)
  cursus: Cursus;

  @IsEnum(StudyDocType)
  type: StudyDocType;

  @IsOptional()
  @IsString()
  docSeries?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
