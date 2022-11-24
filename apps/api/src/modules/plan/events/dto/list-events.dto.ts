import {
 Field, Float, GraphQLISODateTime, InputType, Int,
} from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ListOptionsDto } from '@common/lib/dto/list-options.dto';
import { EventState } from '@common/lib/types/enums/event-state.enum';

@InputType()
export class ListEventsDto extends PartialType(ListOptionsDto) {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  id?: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  before?: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsOptional()
  @IsDate()
  after?: Date;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  priceBelow?: number;

  @Field(() => EventState, { nullable: true })
  @IsOptional()
  @IsEnum(EventState)
  state?: EventState;
}
