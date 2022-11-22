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
import { ListOptionsDto } from '@meta/shared/lib/dto/list-options.dto';
import { TeamEventState } from '@meta/shared/lib/types/enums/team-event-state.enum';

@InputType()
export class ListTeamEventsDto extends PartialType(ListOptionsDto) {
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

  @Field(() => TeamEventState, { nullable: true })
  @IsOptional()
  @IsEnum(TeamEventState)
  state?: TeamEventState;
}
