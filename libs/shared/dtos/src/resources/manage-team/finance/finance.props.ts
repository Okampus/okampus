import { Address } from '../../../embeds/address.embed';
import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { PaymentMethod, FinanceState, FinanceCategory } from '@okampus/shared/enums';
import { IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class FinanceProps {
  @Field(() => String)
  @IsString()
  transaction!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null = null;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  paymentDate!: Date;

  // TODO: Add validation for address
  @Field(() => Address, { nullable: true })
  @IsOptional()
  @IsObject()
  @Type(() => Address)
  address?: Address | null = null;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  amountDue!: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amountPayed?: number = this.amountDue;

  @Field(() => PaymentMethod)
  @IsString()
  // @IsEnum(() => PaymentMethod)
  paymentMethod!: PaymentMethod;

  @Field(() => FinanceState, { nullable: true })
  @IsOptional()
  @IsString()
  // @IsEnum(() => FinanceState)
  state?: FinanceState = FinanceState.Completed;

  @Field(() => FinanceCategory)
  // @IsEnum(() => FinanceCategory) // TODO: fix validation of enum values
  @IsString()
  category!: FinanceCategory;
}
