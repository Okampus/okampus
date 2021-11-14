import { IsOptional, IsString, Length } from 'class-validator';

export class CreateSubjectDto {
  @Length(1, 10)
  @IsString()
  subjectId: string;

  @Length(1, 100)
  @IsString()
  name: string;

  @Length(1, 100)
  @IsString()
  englishName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
