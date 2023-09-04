import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { PaymentMethod, TransactionState, PayedByType, TransactionCategory } from '@okampus/shared/enums';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class TransactionProps {
  @Field(() => Boolean)
  @IsBoolean()
  isOnline?: boolean = false;

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  payedAt?: Date | null = null;

  @Field(() => TransactionCategory, { nullable: true })
  @IsEnum(() => TransactionCategory)
  @IsString()
  category?: TransactionCategory = TransactionCategory.Other;

  @Field(() => PaymentMethod)
  @IsEnum(() => PaymentMethod)
  @IsString()
  method!: PaymentMethod;

  @Field(() => PayedByType, { nullable: true })
  @IsEnum(() => PayedByType)
  @IsOptional()
  @IsString()
  payedByType?: PayedByType = PayedByType.Manual;

  @Field(() => TransactionState, { nullable: true })
  @IsEnum(() => TransactionState)
  @IsOptional()
  @IsString()
  state?: TransactionState = TransactionState.Completed;
}
