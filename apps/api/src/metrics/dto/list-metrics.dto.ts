import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';
import { MetricName } from '../../shared/lib/types/enums/metric-name.enum';

export class ListMetricsDto {
  @IsEnum(MetricName)
  name!: MetricName;

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
