import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Address } from '../../../embeds/address.embed';
import { EventState } from '@okampus/shared/enums';
import { GraphQLJSON } from 'graphql-scalars';
import { JSONObject } from '@okampus/shared/types';
import { Type } from 'class-transformer';

@InputType()
export class TenantEventProps {
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

  // TODO: Add validation for address
  @Field(() => Address)
  @IsObject()
  @Type(() => Address)
  location!: Address;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  regularEventInterval?: string | null;

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
}
