import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
 IsInt, IsNumber, IsOptional, IsString,
} from 'class-validator';
import { CreateInfoDocDto } from './create-info-doc.dto';

export class UpdateStudyDocDto extends PartialType(CreateInfoDocDto) {
  @IsInt()
  @IsOptional()
  year?: number;

  @IsNumber()
  docSeries: number;

  @IsString()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isObsolete?: boolean;
}
