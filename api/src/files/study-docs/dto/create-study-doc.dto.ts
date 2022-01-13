import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateStudyDocDto extends CreateFileUploadDto {
  @IsOptional()
  @IsInt()
  year?: number;

  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  docSeries?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
