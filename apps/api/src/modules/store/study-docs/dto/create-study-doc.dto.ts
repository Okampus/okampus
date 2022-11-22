import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { StudyDocType } from '@meta/shared/lib/types/enums/study-doc-type.enum';
import { CreateFileUploadDto } from '@modules/store/file-uploads/dto/create-file-upload.dto';

export class CreateStudyDocDto extends CreateFileUploadDto {
  @IsInt()
  year: number;

  @IsInt()
  subjectId: number;

  @IsOptional()
  @IsInt()
  schoolGroupId?: number;

  @IsEnum(StudyDocType)
  type: StudyDocType;

  @ApiProperty({ description: "Bitwise combination of the different types for the document. Relevant only for types that start with \"exam\". 1 = Exam sheet, 2 = Student's copy, 3 = Correction." })
  @IsOptional()
  @IsInt()
  @Max(7)
  @Min(1)
  flags?: number;

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
