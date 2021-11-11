import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @MaxLength(10)
  @IsString()
  subjectId: string;

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  name: string;

  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  englishName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
