import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { PaymentMethod, FinanceState, PayedByType, FinanceCategory } from '@okampus/shared/enums';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class FinanceProps {
  @Field(() => String)
  @IsString()
  name!: string;

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

  @Field(() => FinanceCategory, { nullable: true })
  @IsEnum(() => FinanceCategory)
  @IsString()
  category?: FinanceCategory = FinanceCategory.Unknown;

  @Field(() => PaymentMethod)
  @IsEnum(() => PaymentMethod)
  @IsString()
  method!: PaymentMethod;

  @Field(() => PayedByType, { nullable: true })
  @IsEnum(() => PayedByType)
  @IsOptional()
  @IsString()
  payedByType?: PayedByType = PayedByType.Manual;

  @Field(() => FinanceState, { nullable: true })
  @IsEnum(() => FinanceState)
  @IsOptional()
  @IsString()
  state?: FinanceState = FinanceState.Completed;
}
