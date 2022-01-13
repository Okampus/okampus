import { IsString, Length } from 'class-validator';

export class CreateReportDto {
  @Length(10, 2000)
  @IsString()
  reason: string;
}
