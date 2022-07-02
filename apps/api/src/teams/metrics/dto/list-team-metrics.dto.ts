import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { TeamMetricName } from '../../../shared/lib/types/enums/team-metric-type.enum';

export class ListTeamMetricsDto {
  @IsEnum(TeamMetricName)
  name!: TeamMetricName;

  @IsOptional()
  @IsDate()
  before?: Date;

  @IsOptional()
  @IsDate()
  after?: Date;

  @IsOptional()
  @IsInt()
  interval?: number;
}
