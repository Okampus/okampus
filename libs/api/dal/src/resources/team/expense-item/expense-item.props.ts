import { Field, Float, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { TransactionCategory } from '@okampus/shared/enums';
import { IsString, IsEnum, IsDate, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class ExpenseItemProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string = '';

  @Field(() => Float)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  unitCost!: number;

  @Field(() => Int)
  @IsOptional()
  @IsNumber()
  quantity!: number;

  @Field(() => TransactionCategory, { nullable: true })
  @IsEnum(() => TransactionCategory)
  @IsString()
  category?: TransactionCategory = TransactionCategory.Other;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  payedAt?: Date | null = null;
}
