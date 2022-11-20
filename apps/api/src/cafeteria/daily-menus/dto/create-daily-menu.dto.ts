import { IsArray, IsDate, IsInt } from 'class-validator';

export class CreateDailyMenuDto {
  @IsDate()
  date: Date;

  @IsArray()
  @IsInt({ each: true })
  food: number[];
}
