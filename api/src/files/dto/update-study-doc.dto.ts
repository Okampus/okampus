import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { CourseSubject } from '../schemas/course-subject.schema';
import { CreateStudyDocDto } from './create-study-doc.dto';

export class UpdateStudyDocDto extends PartialType(CreateStudyDocDto) {
  @IsNumber()
  @IsOptional()
  year?: number;

  @IsOptional()
  @IsObjectId()
  subject?: CourseSubject;

  @IsString()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  docName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
