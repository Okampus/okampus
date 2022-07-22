import { IsDate, IsString } from 'class-validator';

export class CreateDailyInfoDto {
  @IsDate()
  date: Date;

  @IsString()
  content: string;
}
