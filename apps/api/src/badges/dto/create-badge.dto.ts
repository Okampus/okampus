import { IsEnum, IsInt, IsString } from 'class-validator';
import { BadgeLevel } from '../../shared/lib/types/enums/badge-level.enum';
import { Statistic } from '../../shared/lib/types/enums/statistic.enum';

export class CreateBadgeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  pointPrize: number;

  @IsInt()
  statisticThreshold: number;

  @IsEnum(BadgeLevel)
  level: BadgeLevel;

  @IsString()
  icon: string;

  @IsString()
  series: string;

  @IsEnum(Statistic)
  statistic: Statistic;
}
