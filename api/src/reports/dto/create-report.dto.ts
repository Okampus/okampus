import {
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateReportDto {
  @Length(10, 2000)
  @IsString()
  @IsOptional()
  reason?: string;

  @IsOptional()
  @IsInt()
  contentId?: number;
}
