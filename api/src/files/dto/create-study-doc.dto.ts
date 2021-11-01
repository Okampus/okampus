import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { CourseSubject } from '../schemas/course-subject.schema';
import { CreateFileUploadDto } from './create-file-upload.dto';

export class CreateStudyDocDto extends CreateFileUploadDto {
  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsObjectId()
  subject?: CourseSubject;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  docName?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
