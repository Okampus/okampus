import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { MetricName } from '@meta/shared/lib/types/enums/metric-name.enum';
import { IsIso8601Duration } from '@meta/shared/lib/validators/iso-8601-duration.validator';

@InputType()
export class ListMetricsDto {
  @Field(() => String)
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @ArrayUnique()
  @IsEnum(MetricName, { each: true })
  names!: MetricName[];

  @Field(() => GraphQLISODateTime)
  @IsOptional()
  @IsDate()
  before?: Date;

  @Field(() => GraphQLISODateTime)
  @IsOptional()
  @IsDate()
  after?: Date;

  @Field()
  @IsOptional()
  @IsIso8601Duration()
  interval?: string;
}
