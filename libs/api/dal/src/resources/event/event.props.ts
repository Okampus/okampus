import { Field, Float, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional } from 'class-validator';
import { EventState } from '@okampus/shared/enums';
import { GraphQLJSON } from 'graphql-scalars';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class EventProps {
  @Field(() => GraphQLISODateTime)
  @IsDate()
  start!: Date;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  end!: Date;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  @IsOptional()
  description!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  slug?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number = 0;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  pointsAwardedForAttendance?: number = 0;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  maxParticipants?: number | null = null;

  @Field(() => EventState)
  @IsEnum(EventState)
  state!: EventState;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = false;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isAutoAcceptingJoins?: boolean = true;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean = false;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  meta?: JSONObject = {};
}
