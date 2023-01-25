import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { PaymentMethod, FinanceState, FinanceCategory } from '@okampus/shared/enums';
import { IsDate, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Address } from '../../../embeds/address.embed';
import { Type } from 'class-transformer';

@InputType()
export class FinanceProps {
  @Field(() => String)
  @IsString()
  transaction!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  paymentDate!: Date;

  // TODO: Add validation for address
  @Field(() => Address)
  @IsOptional()
  @IsObject()
  @Type(() => Address)
  address?: Address;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  amountDue!: number;

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amountPayed?: number;

  @Field(() => PaymentMethod)
  @IsEnum(() => PaymentMethod)
  paymentMethod!: PaymentMethod;

  @Field(() => FinanceState)
  @IsEnum(() => FinanceState)
  state!: FinanceState;

  @Field(() => FinanceCategory)
  @IsEnum(() => FinanceCategory)
  category!: FinanceCategory;
}
