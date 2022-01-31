import { IsEnum, IsInt, IsString } from 'class-validator';
import { BadgeLevel } from '../../shared/lib/types/badge-level.enum';
import { Statistic } from '../../shared/lib/types/statistic.enum';

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
  serie: string;

  @IsEnum(Statistic)
  statistic: Statistic;
}
