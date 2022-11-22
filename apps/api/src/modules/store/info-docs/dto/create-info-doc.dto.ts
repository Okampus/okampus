import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateFileUploadDto } from '@modules/store/file-uploads/dto/create-file-upload.dto';

export class CreateInfoDocDto extends CreateFileUploadDto {
  @IsInt()
  year!: number;

  @IsOptional()
  @IsString()
  classId?: string;

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
