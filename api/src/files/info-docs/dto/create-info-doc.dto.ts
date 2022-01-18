import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateInfoDocDto extends CreateFileUploadDto {
  @IsOptional()
  @IsInt()
  year?: number;

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
