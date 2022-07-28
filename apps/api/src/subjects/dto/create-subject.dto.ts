import {
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateSubjectDto {
  @Length(1, 10)
  @IsString()
  code: string;

  @Length(1, 100)
  @IsString()
  name: string;

  @Length(1, 100)
  @IsString()
  englishName: string;

  @IsOptional()
  @IsString()
  schoolGroupId?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
