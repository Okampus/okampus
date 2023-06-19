import { Field, Float, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import { FinanceCategory } from '@okampus/shared/enums';
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

  @Field(() => FinanceCategory, { nullable: true })
  @IsEnum(() => FinanceCategory)
  @IsString()
  category?: FinanceCategory = FinanceCategory.Unknown;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @IsDate()
  payedAt?: Date | null = null;
}
