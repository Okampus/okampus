import {
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateReportDto {
  @IsInt()
  contentId: number;

  @Length(10, 2000)
  @IsString()
  @IsOptional()
  reason?: string;
}
