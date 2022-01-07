import { OmitType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { FileKind } from '../../../shared/lib/types/file-kind.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

export class CreateInfoDocDto extends OmitType(CreateFileUploadDto, ['fileKind']) {
  @IsOptional()
  @IsInt()
  year?: number;

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

  @IsOptional()
  @IsBoolean()
  isObsolete?: boolean;

  @IsOptional()
  @IsIn([FileKind.InfoDoc])
  fileKind?: FileKind.InfoDoc;
}
