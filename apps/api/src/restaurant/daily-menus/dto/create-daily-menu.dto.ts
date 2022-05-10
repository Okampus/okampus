import { IsArray, IsInt, Matches } from 'class-validator';
import { iso8601Regex } from '../../../shared/lib/utils/iso-8601-date';

export class CreateDailyMenuDto {
  @Matches(iso8601Regex, { message: 'date must be in format YYYY-MM-DD' })
  date: string;

  @IsArray()
  @IsInt({ each: true })
  starters: number[];

  @IsArray()
  @IsInt({ each: true })
  dishes: number[];

  @IsArray()
  @IsInt({ each: true })
  desserts: number[];
}
