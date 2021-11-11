import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateStudyDocDto } from './create-study-doc.dto';

export class UpdateStudyDocDto extends PartialType(CreateStudyDocDto) {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsOptional()
  @IsNumber()
  subject?: number;

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
}
