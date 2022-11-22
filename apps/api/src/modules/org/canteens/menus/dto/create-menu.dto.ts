import { IsArray, IsDate, IsInt } from 'class-validator';

export class CreateMenuDto {
  @IsDate()
  date: Date;

  @IsArray()
  @IsInt({ each: true })
  food: number[];
}
