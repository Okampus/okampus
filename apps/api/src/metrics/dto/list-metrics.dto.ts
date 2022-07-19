import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { MetricName } from '../../shared/lib/types/enums/metric-name.enum';
import { IsIso8601Duration } from '../../shared/lib/validators/iso-8601-duration.validator';

export class ListMetricsDto {
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @ArrayUnique()
  @IsEnum(MetricName, { each: true })
  names!: MetricName[];

  @IsOptional()
  @IsDate()
  before?: Date;

  @IsOptional()
  @IsDate()
  after?: Date;

  @IsOptional()
  @IsIso8601Duration()
  interval?: string;
}
