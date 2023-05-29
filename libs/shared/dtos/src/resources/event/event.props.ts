import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString, Length, Matches } from 'class-validator';
import { EventState } from '@okampus/shared/enums';
import { GraphQLJSON } from 'graphql-scalars';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class EventProps {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 100)
  @Matches(/^[\d:a-z-]+$/)
  @IsString()
  slug?: string | null;

  @Field(() => String)
  @Length(1, 100)
  @IsString()
  name!: string;

  @Field(() => String)
  @Length(1, 10_000)
  @IsString()
  text!: string;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  start!: Date;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  end!: Date;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  presenceReward?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  budget: number | null = null;

  @Field(() => EventState)
  @IsEnum(EventState)
  state!: EventState;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  @IsObject()
  meta?: JSONObject;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  private?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  autoAcceptJoins?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  regularEventInterval?: string | null;
}
