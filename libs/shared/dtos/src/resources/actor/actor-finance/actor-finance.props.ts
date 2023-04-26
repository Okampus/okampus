import { Field, Float, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { FinanceCategory } from '@okampus/shared/enums';
import { IsString, IsEnum, IsDate, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class ActorFinanceProps {
  @Field(() => String)
  @IsString()
  name!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null = null;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount!: number;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  payedAt!: Date;

  @Field(() => FinanceCategory)
  @IsEnum(() => FinanceCategory)
  @IsString()
  category!: FinanceCategory;
}
