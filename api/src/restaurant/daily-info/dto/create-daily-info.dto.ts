import { IsString, Matches } from 'class-validator';
import { iso8601Regex } from '../../../shared/lib/utils/iso-8601-date';

export class CreateDailyInfoDto {
  @Matches(iso8601Regex, { message: 'date must be in format YYYY-MM-DD' })
  date: string;

  @IsString()
  content: string;
}
